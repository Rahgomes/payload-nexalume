import type { Payload } from 'payload'
import type { User } from '@/payload-types'

const COLLECTION_TITLE_FIELDS: Record<string, string> = {
  users: 'fullName',
  clients: 'name',
  'whatsapp-campaigns': 'title',
  services: 'title',
  media: 'alt',
  'media-categories': 'name',
}

const COLLECTION_LABELS: Record<string, string> = {
  users: 'usuário',
  clients: 'cliente',
  'whatsapp-campaigns': 'campanha',
  services: 'serviço',
  media: 'mídia',
  'media-categories': 'categoria de mídia',
}

const ACTION_LABELS: Record<string, string> = {
  create: 'Criou',
  update: 'Atualizou',
  delete: 'Excluiu',
  login: 'Fez login',
  logout: 'Fez logout',
}

const EXCLUDED_FIELDS = [
  'updatedAt',
  'createdAt',
  'salt',
  'hash',
  'resetPasswordToken',
  'resetPasswordExpiration',
  'loginAttempts',
  'lockUntil',
  '_status',
]

type AuditLogParams = {
  payload: Payload
  user?: User | null
  action: 'create' | 'update' | 'delete' | 'login' | 'logout'
  collectionSlug: string
  recordId?: string | number
  doc?: Record<string, unknown>
  previousDoc?: Record<string, unknown>
}

function buildSummary(params: AuditLogParams): string {
  const { action, collectionSlug, doc, previousDoc } = params
  const actionLabel = ACTION_LABELS[action] || action
  const collectionLabel = COLLECTION_LABELS[collectionSlug] || collectionSlug
  const titleField = COLLECTION_TITLE_FIELDS[collectionSlug]
  const title = doc?.[titleField] as string | undefined

  if (action === 'login' || action === 'logout') {
    const userName = (doc?.fullName as string) || (doc?.email as string) || 'Usuário desconhecido'
    return `${actionLabel}: ${userName}`
  }

  if (action === 'delete') {
    return `${actionLabel} ${collectionLabel}: ${title || `ID ${params.recordId}`}`
  }

  if (action === 'update' && previousDoc && doc) {
    const statusChanged =
      doc.status !== undefined &&
      previousDoc.status !== undefined &&
      doc.status !== previousDoc.status

    if (statusChanged) {
      return `${actionLabel} status de ${collectionLabel}: ${title || `ID ${params.recordId}`} (${previousDoc.status} → ${doc.status})`
    }
  }

  return `${actionLabel} ${collectionLabel}: ${title || `ID ${params.recordId}`}`
}

function computeChanges(
  previousDoc: Record<string, unknown> | undefined,
  doc: Record<string, unknown> | undefined,
): { before: Record<string, unknown>; after: Record<string, unknown> } | null {
  if (!previousDoc || !doc) return null

  const before: Record<string, unknown> = {}
  const after: Record<string, unknown> = {}
  let hasChanges = false

  for (const key of Object.keys(doc)) {
    if (EXCLUDED_FIELDS.includes(key)) continue

    const prevStr = JSON.stringify(previousDoc[key])
    const newStr = JSON.stringify(doc[key])

    if (prevStr !== newStr) {
      before[key] = previousDoc[key]
      after[key] = doc[key]
      hasChanges = true
    }
  }

  return hasChanges ? { before, after } : null
}

export async function createAuditLog(params: AuditLogParams): Promise<void> {
  const { payload, user, action, collectionSlug, recordId, doc, previousDoc } = params

  try {
    const summary = buildSummary(params)
    const changes = action === 'update' ? computeChanges(previousDoc, doc) : null

    await payload.create({
      collection: 'audit-logs',
      overrideAccess: true,
      data: {
        user: user?.id ?? null,
        action,
        collection: collectionSlug,
        recordId: recordId != null ? String(recordId) : undefined,
        summary,
        changesBefore: changes?.before ?? (action === 'delete' ? previousDoc : undefined),
        changesAfter: changes?.after ?? (action === 'create' ? doc : undefined),
      },
    })
  } catch (err) {
    console.error('[AuditLog] Falha ao criar log de auditoria:', err)
  }
}
