import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access'
import { isAdminOrEditorContentOnly } from '@/access/isAdminOrEditorContentOnly'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  labels: {
    singular: 'Log de Atividade',
    plural: 'Logs de Atividade',
  },
  admin: {
    useAsTitle: 'summary',
    defaultColumns: ['summary', 'action', 'collection', 'user', 'createdAt'],
    components: {
      beforeList: ['@/components/admin/AuditLogs/Breadcrumb'],
      edit: {
        beforeDocumentControls: ['@/components/admin/AuditLogs/Breadcrumb'],
      },
    },
  },
  access: {
    read: isAdminOrEditorContentOnly,
    create: () => false,
    update: () => false,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'user',
      label: 'Usuário',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'action',
      label: 'Ação',
      type: 'select',
      required: true,
      options: [
        { label: 'Criação', value: 'create' },
        { label: 'Atualização', value: 'update' },
        { label: 'Exclusão', value: 'delete' },
        { label: 'Login', value: 'login' },
        { label: 'Logout', value: 'logout' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'collection',
      label: 'Coleção',
      type: 'select',
      required: true,
      options: [
        { label: 'Usuários', value: 'users' },
        { label: 'Clientes', value: 'clients' },
        { label: 'Campanhas WhatsApp', value: 'whatsapp-campaigns' },
        { label: 'Serviços', value: 'services' },
        { label: 'Mídias', value: 'media' },
        { label: 'Categorias de Mídia', value: 'media-categories' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'recordId',
      label: 'ID do Registro',
      type: 'text',
      required: false,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'summary',
      label: 'Resumo',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'changesBefore',
      label: 'Estado Anterior',
      type: 'json',
      required: false,
      admin: {
        readOnly: true,
        description: 'Snapshot dos campos antes da alteração',
      },
    },
    {
      name: 'changesAfter',
      label: 'Estado Posterior',
      type: 'json',
      required: false,
      admin: {
        readOnly: true,
        description: 'Snapshot dos campos após a alteração',
      },
    },
  ],
}
