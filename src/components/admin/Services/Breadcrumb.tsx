'use client'

import { useStepNav, useConfig } from '@payloadcms/ui'
import { useEffect, useRef } from 'react'

export default function ServicesBreadcrumb() {
  const { stepNav, setStepNav } = useStepNav()
  const { config } = useConfig()
  const adminRoute = config.routes.admin
  const modified = useRef(false)

  useEffect(() => {
    if (stepNav.length > 0 && !modified.current) {
      modified.current = true
      setStepNav([
        { label: 'Clientes', url: `${adminRoute}/collections/clients` },
        ...stepNav,
      ])
    }
  }, [stepNav, setStepNav, adminRoute])

  return null
}
