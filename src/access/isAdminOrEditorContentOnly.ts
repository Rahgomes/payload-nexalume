import type { Access } from 'payload'
import { checkRole } from './checkRole'

export const isAdminOrEditorContentOnly: Access = ({ req: { user } }) => {
  if (!user) return false

  if (checkRole(['admin'], user)) return true

  if (checkRole(['editor'], user)) {
    return {
      collection: {
        not_equals: 'users',
      },
    }
  }

  return false
}
