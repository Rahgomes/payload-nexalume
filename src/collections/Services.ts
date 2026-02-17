import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, isAuthenticated } from '@/access'

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
