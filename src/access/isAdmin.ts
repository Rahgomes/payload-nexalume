import type { Access } from 'payload'
import { checkRole } from './checkRole'

export const isAdmin: Access = ({ req: { user } }) => {
  return checkRole(['admin'], user)
}
