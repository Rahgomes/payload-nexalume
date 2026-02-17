'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useNav } from '@payloadcms/ui'
import { TbLayoutDashboard, TbUsers, TbPhoto, TbSettings } from 'react-icons/tb'

import './Nav.scss'

const collectionIcons: Record<string, React.ReactNode> = {
  users: <TbUsers />,
  media: <TbPhoto />,
}

type NavItem = {
  href: string
  label: string
  slug: string
}

type NavClientProps = {
  adminRoute: string
  items: NavItem[]
}

export const NavClient: React.FC<NavClientProps> = ({ adminRoute, items }) => {
  const pathname = usePathname()
  const { navOpen, navRef } = useNav()

  const isDashboardActive = pathname === adminRoute || pathname === `${adminRoute}/`

  return (
    <aside className={`nexalume-nav ${navOpen ? 'nexalume-nav--open' : ''}`} ref={navRef}>
      {/* Brand */}
      <div className="nexalume-nav__brand">
        <div className="nexalume-nav__brand-icon" />
        <span className="nexalume-nav__brand-text">Nexa Lume</span>
      </div>

      {/* Dashboard */}
      <div className="nexalume-nav__section">
        <div className="nexalume-nav__links">
          <Link
            href={adminRoute}
            className={`nexalume-nav__link ${isDashboardActive ? 'nexalume-nav__link--active' : ''}`}
            prefetch={false}
          >
            <TbLayoutDashboard />
            <span className="nexalume-nav__link-label">Dashboard</span>
          </Link>
        </div>
      </div>

      <div className="nexalume-nav__divider" />

      {/* Menu (collections) */}
      <div className="nexalume-nav__section">
        <div className="nexalume-nav__section-title">Menu</div>
        <div className="nexalume-nav__links">
          {items.map(({ href, label, slug }) => {
            const isActive = pathname.startsWith(href)

            return (
              <Link
                key={slug}
                href={href}
                className={`nexalume-nav__link ${isActive ? 'nexalume-nav__link--active' : ''}`}
                prefetch={false}
              >
                {collectionIcons[slug] ?? <TbLayoutDashboard />}
                <span className="nexalume-nav__link-label">{label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="nexalume-nav__spacer" />

      {/* Footer */}
      <div className="nexalume-nav__footer">
        <Link
          href={`${adminRoute}/account`}
          className={`nexalume-nav__link ${pathname.startsWith(`${adminRoute}/account`) ? 'nexalume-nav__link--active' : ''}`}
          prefetch={false}
        >
          <TbSettings />
          <span className="nexalume-nav__link-label">Configurações</span>
        </Link>
      </div>
    </aside>
  )
}
