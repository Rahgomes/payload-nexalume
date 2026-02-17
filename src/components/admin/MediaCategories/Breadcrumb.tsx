'use client'

import { useStepNav, useConfig } from '@payloadcms/ui'
import { useEffect, useRef } from 'react'

export default function MediaCategoriesBreadcrumb() {
  const { stepNav, setStepNav } = useStepNav()
  const { config } = useConfig()
  const adminRoute = config.routes.admin
  const modified = useRef(false)

  useEffect(() => {
    if (stepNav.length > 0 && !modified.current) {
      modified.current = true
      setStepNav([
        { label: 'Mídias', url: `${adminRoute}/collections/media` },
        ...stepNav,
      ])
    }
  }, [stepNav, setStepNav, adminRoute])

  return null
}
