import type { CollectionConfig } from 'payload'
import {
  isAdmin,
  isAdminOrEditor,
  isAuthenticated,
  isAdminFieldAccess,
  checkRole,
} from '@/access'
import { createAuditLog } from '@/hooks/auditLog'

export const WhatsappCampaigns: CollectionConfig = {
  slug: 'whatsapp-campaigns',
  labels: {
    singular: 'Campanha WhatsApp',
    plural: 'Campanhas WhatsApp',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'scheduledAt', 'sentCount', 'updatedAt'],
    components: {
      beforeList: ['@/components/admin/WhatsappCampaigns/Breadcrumb'],
      edit: {
        beforeDocumentControls: ['@/components/admin/WhatsappCampaigns/Breadcrumb'],
      },
    },
  },
  access: {
    read: isAuthenticated,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, operation, req }) => {
        const user = req.user
        if (!user) return data

        if (checkRole(['editor'], user) && !checkRole(['admin'], user)) {
          const nonEditableStatuses = ['agendado', 'andamento', 'concluido', 'erro']

          // Editor não pode definir status diferente de rascunho
          if (data.status && nonEditableStatuses.includes(data.status)) {
            throw new Error('Editores não podem alterar o status além de rascunho')
          }

          // Editor não pode editar campanha que já saiu de rascunho
          if (
            operation === 'update' &&
            originalDoc?.status &&
            originalDoc.status !== 'rascunho'
          ) {
            throw new Error('Editores não podem editar campanhas que já foram agendadas ou enviadas')
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc }) => {
        const statusChanged = doc.status !== previousDoc?.status

        if (doc.status === 'agendado' && statusChanged) {
          const webhookUrl = process.env.N8N_WEBHOOK_URL
          if (!webhookUrl) return doc

          try {
            await fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                campaignId: doc.id,
                title: doc.title,
                messageTemplate: doc.messageTemplate,
                targetAudience: doc.targetAudience,
                scheduledAt: doc.scheduledAt,
              }),
            })
          } catch (err) {
            console.error('[n8n webhook] Falha ao notificar:', err)
          }
        }

        return doc
      },
      async ({ doc, previousDoc, operation, req }) => {
        await createAuditLog({
          payload: req.payload,
          user: req.user ?? null,
          action: operation === 'create' ? 'create' : 'update',
          collectionSlug: 'whatsapp-campaigns',
          recordId: doc.id,
          doc: doc as unknown as Record<string, unknown>,
          previousDoc: previousDoc as unknown as Record<string, unknown> | undefined,
        })
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        await createAuditLog({
          payload: req.payload,
          user: req.user ?? null,
          action: 'delete',
          collectionSlug: 'whatsapp-campaigns',
          recordId: doc.id,
          previousDoc: doc as unknown as Record<string, unknown>,
        })
      },
    ],
  },
  endpoints: [
    {
      path: '/:id/callback',
      method: 'patch',
      handler: async (req) => {
        const apiKey = req.headers.get('x-api-key')
        if (apiKey !== process.env.N8N_CALLBACK_API_KEY) {
          return Response.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const id = req.routeParams?.id as string
        if (!id) {
          return Response.json({ error: 'ID não informado' }, { status: 400 })
        }

        const body = await req.json?.()
        if (!body) {
          return Response.json({ error: 'Body inválido' }, { status: 400 })
        }

        const { status, sentCount, failedCount, logs } = body

        try {
          const updated = await req.payload.update({
            collection: 'whatsapp-campaigns',
            id,
            data: { status, sentCount, failedCount, logs },
            overrideAccess: true,
          })

          return Response.json(updated)
        } catch (err) {
          return Response.json({ error: 'Falha ao atualizar campanha' }, { status: 500 })
        }
      },
    },
  ],
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Conteúdo',
          fields: [
            {
              name: 'title',
              label: 'Nome da Campanha',
              type: 'text',
              required: true,
              index: true,
              admin: {
                placeholder: 'Black Friday 2026 - Clientes VIP',
              },
            },
            {
              name: 'messageTemplate',
              label: 'Modelo de Mensagem',
              type: 'richText',
              required: true,
              admin: {
                description: 'Use {{nome}} para personalização',
              },
            },
          ],
        },
        {
          label: 'Público',
          fields: [
            {
              name: 'targetAudience',
              label: 'Público-Alvo',
              type: 'relationship',
              relationTo: 'clients',
              hasMany: true,
            },
            {
              name: 'scheduledAt',
              label: 'Agendamento',
              type: 'date',
              required: true,
              defaultValue: () => {
                const d = new Date()
                d.setHours(d.getHours() + 1)
                return d.toISOString()
              },
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                  displayFormat: 'dd/MM/yyyy HH:mm',
                },
              },
            },
          ],
        },
        {
          label: 'Resultados',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'sentCount',
                  label: 'Enviados',
                  type: 'number',
                  defaultValue: 0,
                  admin: {
                    readOnly: true,
                    width: '50%',
                  },
                },
                {
                  name: 'failedCount',
                  label: 'Falhas',
                  type: 'number',
                  defaultValue: 0,
                  admin: {
                    readOnly: true,
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'logs',
              label: 'Logs Técnicos',
              type: 'json',
              admin: {
                readOnly: true,
                description: 'Dados automáticos do n8n',
              },
              access: {
                read: isAdminFieldAccess,
                create: isAdminFieldAccess,
                update: isAdminFieldAccess,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'rascunho',
      options: [
        { label: 'Rascunho', value: 'rascunho' },
        { label: 'Agendado', value: 'agendado' },
        { label: 'Em Andamento', value: 'andamento' },
        { label: 'Concluído', value: 'concluido' },
        { label: 'Erro', value: 'erro' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
