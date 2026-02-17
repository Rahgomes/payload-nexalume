import React from 'react'
import { getTranslation } from '@payloadcms/translations'
import type { AdminViewProps } from 'payload'

import { CollectionCardsClient } from './CollectionCardsClient'

const collectionDescriptions: Record<string, string> = {
  users: 'Gerencie os usuários e permissões do sistema',
  'media-categories': 'Organize mídias em categorias hierárquicas',
  media: 'Faça upload e organize imagens e arquivos',
  clients: 'Gerencie clientes, leads e relacionamentos comerciais',
  services: 'Cadastre os tipos de serviço oferecidos',
}

export const CustomCollectionCards: React.FC<AdminViewProps> = ({
  initPageResult,
}) => {
  const { req, visibleEntities } = initPageResult
  const { i18n, payload } = req
  const { collections } = payload.config
  const adminRoute = payload.config.routes.admin

  const visibleCollections = collections.filter(({ slug }) =>
    visibleEntities?.collections?.includes(slug),
  )

  const items = visibleCollections.map((collection) => ({
    slug: collection.slug,
    label: getTranslation(collection.labels.plural, i18n) as string,
    href: `${adminRoute}/collections/${collection.slug}`,
    description: collectionDescriptions[collection.slug] ?? '',
  }))

  return <CollectionCardsClient items={items} />
}
