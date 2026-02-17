import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access'

export const MediaCategories: CollectionConfig = {
  slug: 'media-categories',
  labels: {
    singular: 'Categoria de Mídia',
    plural: 'Categorias de Mídia',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'parent', 'updatedAt'],
    components: {
      beforeList: ['@/components/admin/MediaCategories/Breadcrumb'],
      edit: {
        beforeDocumentControls: ['@/components/admin/MediaCategories/Breadcrumb'],
      },
    },
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'name',
      label: 'Nome',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea',
      required: false,
    },
    {
      name: 'parent',
      label: 'Categoria Pai',
      type: 'relationship',
      relationTo: 'media-categories',
      required: false,
      admin: {
        description: 'Selecione uma categoria pai para criar hierarquia.',
      },
    },
  ],
}
