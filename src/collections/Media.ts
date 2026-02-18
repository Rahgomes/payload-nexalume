import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access'
import { createAuditLog } from '@/hooks/auditLog'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Mídia',
    plural: 'Mídias',
  },
  admin: {
    components: {
      beforeListTable: ['@/components/admin/Media/MediaListHeader'],
    },
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        await createAuditLog({
          payload: req.payload,
          user: req.user ?? null,
          action: operation === 'create' ? 'create' : 'update',
          collectionSlug: 'media',
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
          collectionSlug: 'media',
          recordId: doc.id,
          previousDoc: doc as unknown as Record<string, unknown>,
        })
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Texto Alternativo',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea',
      required: false,
    },
    {
      name: 'category',
      label: 'Categoria',
      type: 'relationship',
      relationTo: 'media-categories',
      required: false,
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'array',
      required: false,
      labels: {
        singular: 'Tag',
        plural: 'Tags',
      },
      fields: [
        {
          name: 'tag',
          label: 'Tag',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  upload: {
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        fit: 'cover',
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 576,
        fit: 'cover',
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        fit: 'inside',
        withoutEnlargement: true,
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        fit: 'cover',
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
}
