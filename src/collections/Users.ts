import type { CollectionConfig } from 'payload'
import type { User } from '@/payload-types'
import { isAdmin, isAdminOrSelf, isAdminFieldAccess } from '@/access'
import { createAuditLog } from '@/hooks/auditLog'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Usuário',
    plural: 'Usuários',
  },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'role', 'status'],
  },
  auth: true,
  forceSelect: {
    role: true,
    status: true,
    fullName: true,
  },
  access: {
    admin: ({ req }) => {
      if (!req.user) return false
      return req.user.role === 'admin'
    },
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeLogin: [
      ({ user }) => {
        if (user.status === 'inactive') {
          throw new Error(
            'Sua conta está inativa. Entre em contato com o administrador.',
          )
        }
        return user
      },
    ],
    afterLogin: [
      async ({ req, user }) => {
        await createAuditLog({
          payload: req.payload,
          user: user as User,
          action: 'login',
          collectionSlug: 'users',
          recordId: user.id,
          doc: user as unknown as Record<string, unknown>,
        })
        return user
      },
    ],
    beforeChange: [
      async ({ data, operation, req }) => {
        // Bootstrap: primeiro usuário criado recebe role admin automaticamente
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({
            collection: 'users',
            req,
          })
          if (totalDocs === 0) {
            data.role = 'admin'
            data.status = 'active'
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        await createAuditLog({
          payload: req.payload,
          user: req.user ?? null,
          action: operation === 'create' ? 'create' : 'update',
          collectionSlug: 'users',
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
          collectionSlug: 'users',
          recordId: doc.id,
          previousDoc: doc as unknown as Record<string, unknown>,
        })
      },
    ],
  },
  fields: [
    {
      name: 'fullName',
      label: 'Nome completo',
      type: 'text',
      required: true,
      index: true,
    },
    // email é adicionado automaticamente pelo auth: true
    {
      name: 'role',
      label: 'Função / Permissão',
      type: 'select',
      required: true,
      defaultValue: 'viewer',
      saveToJWT: true,
      hasMany: false,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
      access: {
        create: isAdminFieldAccess,
        update: isAdminFieldAccess,
      },
      admin: {
        description:
          'Define as permissões de acesso do usuário no sistema.',
      },
    },
    {
      name: 'phone',
      label: 'Telefone de contato',
      type: 'text',
      required: false,
      admin: {
        placeholder: '(11) 99999-9999',
      },
    },
    {
      name: 'profilePicture',
      label: 'Foto de perfil',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Imagem de perfil do usuário.',
      },
    },
    {
      name: 'status',
      label: 'Status do usuário',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Ativo', value: 'active' },
        { label: 'Inativo', value: 'inactive' },
      ],
      access: {
        create: isAdminFieldAccess,
        update: isAdminFieldAccess,
      },
      admin: {
        description: 'Usuários inativos não conseguem fazer login.',
        position: 'sidebar',
      },
    },
  ],
}
