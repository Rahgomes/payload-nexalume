import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, isAuthenticated } from '@/access'
import { createAuditLog } from '@/hooks/auditLog'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Tipo de Serviço',
    plural: 'Tipos de Serviço',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
    components: {
      beforeList: ['@/components/admin/Services/Breadcrumb'],
      edit: {
        beforeDocumentControls: ['@/components/admin/Services/Breadcrumb'],
      },
    },
  },
  access: {
    read: isAuthenticated,
    create: isAdmin,
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
          collectionSlug: 'services',
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
          collectionSlug: 'services',
          recordId: doc.id,
          previousDoc: doc as unknown as Record<string, unknown>,
        })
      },
    ],
  },
  fields: [
    {
      name: 'title',
      label: 'Nome do serviço',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'description',
      label: 'Descrição breve',
      type: 'textarea',
      required: false,
    },
  ],
}
