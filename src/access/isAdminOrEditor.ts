import type { Access } from 'payload'
import { checkRole } from './checkRole'

export const isAdminOrEditor: Access = ({ req: { user } }) => {
  return checkRole(['admin', 'editor'], user)
}
