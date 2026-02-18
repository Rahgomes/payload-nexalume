import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, isAuthenticated } from '@/access'
import { createAuditLog } from '@/hooks/auditLog'

export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: {
    singular: 'Cliente',
    plural: 'Clientes',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'companyName', 'status', 'responsibleUser', 'updatedAt'],
    components: {
      beforeListTable: ['@/components/admin/Clients/ClientsListHeader'],
    },
  },
  access: {
    read: isAuthenticated,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        await createAuditLog({
          payload: req.payload,
          user: req.user ?? null,
          action: operation === 'create' ? 'create' : 'update',
          collectionSlug: 'clients',
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
          collectionSlug: 'clients',
          recordId: doc.id,
          previousDoc: doc as unknown as Record<string, unknown>,
        })
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Dados Básicos',
          fields: [
            {
              name: 'name',
              label: 'Nome do contato principal',
              type: 'text',
              required: true,
              index: true,
            },
            {
              name: 'companyName',
              label: 'Nome da empresa',
              type: 'text',
              required: false,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'email',
                  label: 'E-mail principal',
                  type: 'email',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'phone',
                  label: 'Telefone principal',
                  type: 'text',
                  required: false,
                  admin: {
                    width: '50%',
                    placeholder: '(11) 99999-9999',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'website',
                  label: 'Site da empresa',
                  type: 'text',
                  required: false,
                  admin: {
                    width: '50%',
                    placeholder: 'https://exemplo.com.br',
                  },
                },
                {
                  name: 'cnpjCpf',
                  label: 'CNPJ / CPF',
                  type: 'text',
                  required: false,
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Relacionamento & Status',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'status',
                  label: 'Status do cliente',
                  type: 'select',
                  required: true,
                  defaultValue: 'lead',
                  options: [
                    { label: 'Lead', value: 'lead' },
                    { label: 'Proposta enviada', value: 'proposalSent' },
                    { label: 'Ativo', value: 'active' },
                    { label: 'Em pausa', value: 'paused' },
                    { label: 'Inativo', value: 'inactive' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'serviceType',
                  label: 'Tipo de serviço',
                  type: 'relationship',
                  relationTo: 'services',
                  required: false,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'responsibleUser',
                  label: 'Responsável interno',
                  type: 'relationship',
                  relationTo: 'users',
                  required: false,
                  admin: { width: '50%' },
                },
                {
                  name: 'startDate',
                  label: 'Data de início do relacionamento/contrato',
                  type: 'date',
                  required: false,
                  admin: {
                    width: '50%',
                    date: {
                      pickerAppearance: 'dayOnly',
                      displayFormat: 'dd/MM/yyyy',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Observações',
          fields: [
            {
              name: 'notes',
              label: 'Observações internas',
              type: 'richText',
            },
          ],
        },
      ],
    },
  ],
}
