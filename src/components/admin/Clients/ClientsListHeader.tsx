'use client'

import Link from 'next/link'
import { useConfig } from '@payloadcms/ui'
import { TbBriefcase } from 'react-icons/tb'

export default function ClientsListHeader() {
  const { config } = useConfig()
  const adminRoute = config.routes.admin

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
      <Link
        href={`${adminRoute}/collections/services`}
        prefetch={false}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          padding: '0.375rem 0.75rem',
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--theme-elevation-600)',
          textDecoration: 'none',
          borderRadius: '0.375rem',
          border: '1px solid var(--theme-elevation-200)',
          transition: 'background-color 150ms ease, color 150ms ease, border-color 150ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--theme-elevation-100)'
          e.currentTarget.style.color = 'var(--color-success-500)'
          e.currentTarget.style.borderColor = 'var(--theme-elevation-350)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = 'var(--theme-elevation-600)'
          e.currentTarget.style.borderColor = 'var(--theme-elevation-200)'
        }}
      >
        <TbBriefcase style={{ width: '1rem', height: '1rem' }} />
        Tipos de Serviço
      </Link>
    </div>
  )
}
