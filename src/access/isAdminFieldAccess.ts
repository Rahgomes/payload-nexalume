import type { FieldAccess } from 'payload'
import { checkRole } from './checkRole'

export const isAdminFieldAccess: FieldAccess = ({ req: { user } }) => {
  return checkRole(['admin'], user)
}
