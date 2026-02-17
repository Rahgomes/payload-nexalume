import type { User } from '../payload-types'

export type Role = 'admin' | 'editor' | 'viewer'

export const checkRole = (
  allowedRoles: Role[],
  user: User | null | undefined,
): boolean => {
  if (!user) return false
  const userRole = user.role as Role | undefined
  if (!userRole) return false
  return allowedRoles.includes(userRole)
}
