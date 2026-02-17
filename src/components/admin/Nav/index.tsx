import React from 'react'
import { getTranslation } from '@payloadcms/translations'
import type { ServerProps } from 'payload'

import { NavClient } from './NavClient'

export const CustomNav: React.FC<ServerProps> = ({ i18n, payload, visibleEntities }) => {
  if (!payload?.config) return null

  const { collections } = payload.config
  const adminRoute = payload.config.routes.admin

  const items = collections
    .filter(({ slug }) => visibleEntities?.collections.includes(slug))
    .map((collection) => ({
      slug: collection.slug,
      label: getTranslation(collection.labels.plural, i18n) as string,
      href: `${adminRoute}/collections/${collection.slug}`,
    }))

  return <NavClient adminRoute={adminRoute} items={items} />
}
