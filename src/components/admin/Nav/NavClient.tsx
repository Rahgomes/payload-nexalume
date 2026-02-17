'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { useNav } from '@payloadcms/ui'
import {
  TbLayoutDashboard,
  TbUsers,
  TbPhoto,
  TbSettings,
  TbCategory,
  TbChevronRight,
  TbAddressBook,
  TbBriefcase,
  TbBrandWhatsapp,
} from 'react-icons/tb'

import './Nav.scss'

const collectionIcons: Record<string, React.ReactNode> = {
  users: <TbUsers />,
  media: <TbPhoto />,
  'media-categories': <TbCategory />,
  clients: <TbAddressBook />,
  services: <TbBriefcase />,
  'whatsapp-campaigns': <TbBrandWhatsapp />,
}

type NavItem = {
  href: string
  label: string
  slug: string
}

type NavClientProps = {
  adminRoute: string
  items: NavItem[]
  mediaSubItems: NavItem[]
  clientsSubItems: NavItem[]
  toolsSubItems: NavItem[]
}

export const NavClient: React.FC<NavClientProps> = ({
  adminRoute,
  items,
  mediaSubItems,
  clientsSubItems,
  toolsSubItems,
}) => {
  const pathname = usePathname()
  const { navOpen, navRef } = useNav()
  const [mediaOpen, setMediaOpen] = useState(false)
  const [clientsOpen, setClientsOpen] = useState(false)

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
            const isMedia = slug === 'media'
            const isClients = slug === 'clients'
            const isCollectionActive = pathname.startsWith(href)
            const isMediaCategoryActive =
              isMedia && pathname.includes('/collections/media-categories')
            const isServicesActive =
              isClients && pathname.includes('/collections/services')
            const isActive = isCollectionActive || isMediaCategoryActive || isServicesActive

            if (isMedia && mediaSubItems.length > 0) {
              return (
                <div
                  key={slug}
                  className="nexalume-nav__group"
                  onMouseEnter={() => setMediaOpen(true)}
                  onMouseLeave={() => setMediaOpen(false)}
                >
                  <Link
                    href={href}
                    className={`nexalume-nav__link ${isActive ? 'nexalume-nav__link--active' : ''}`}
                    prefetch={false}
                  >
                    {collectionIcons[slug] ?? <TbLayoutDashboard />}
                    <span className="nexalume-nav__link-label">{label}</span>
                    <TbChevronRight
                      className={`nexalume-nav__chevron ${mediaOpen ? 'nexalume-nav__chevron--open' : ''}`}
                    />
                  </Link>
                  <div
                    className={`nexalume-nav__submenu ${mediaOpen ? 'nexalume-nav__submenu--open' : ''}`}
                  >
                    {mediaSubItems.map((sub) => {
                      const isSubActive = pathname.startsWith(sub.href)
                      return (
                        <Link
                          key={sub.slug}
                          href={sub.href}
                          className={`nexalume-nav__submenu-link ${isSubActive ? 'nexalume-nav__submenu-link--active' : ''}`}
                          prefetch={false}
                        >
                          {collectionIcons[sub.slug] ?? <TbLayoutDashboard />}
                          <span className="nexalume-nav__link-label">{sub.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            }

            if (isClients && clientsSubItems.length > 0) {
              return (
                <div
                  key={slug}
                  className="nexalume-nav__group"
                  onMouseEnter={() => setClientsOpen(true)}
                  onMouseLeave={() => setClientsOpen(false)}
                >
                  <Link
                    href={href}
                    className={`nexalume-nav__link ${isActive ? 'nexalume-nav__link--active' : ''}`}
                    prefetch={false}
                  >
                    {collectionIcons[slug] ?? <TbLayoutDashboard />}
                    <span className="nexalume-nav__link-label">{label}</span>
                    <TbChevronRight
                      className={`nexalume-nav__chevron ${clientsOpen ? 'nexalume-nav__chevron--open' : ''}`}
                    />
                  </Link>
                  <div
                    className={`nexalume-nav__submenu ${clientsOpen ? 'nexalume-nav__submenu--open' : ''}`}
                  >
                    {clientsSubItems.map((sub) => {
                      const isSubActive = pathname.startsWith(sub.href)
                      return (
                        <Link
                          key={sub.slug}
                          href={sub.href}
                          className={`nexalume-nav__submenu-link ${isSubActive ? 'nexalume-nav__submenu-link--active' : ''}`}
                          prefetch={false}
                        >
                          {collectionIcons[sub.slug] ?? <TbLayoutDashboard />}
                          <span className="nexalume-nav__link-label">{sub.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            }

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

      {/* Ferramentas */}
      {toolsSubItems.length > 0 && (
        <>
          <div className="nexalume-nav__divider" />
          <div className="nexalume-nav__section">
            <div className="nexalume-nav__section-title">Ferramentas</div>
            <div className="nexalume-nav__links">
              {toolsSubItems.map((sub) => {
                const isSubActive =
                  pathname.startsWith(sub.href) ||
                  pathname.includes(`/collections/${sub.slug}`)
                return (
                  <Link
                    key={sub.slug}
                    href={sub.href}
                    className={`nexalume-nav__link ${isSubActive ? 'nexalume-nav__link--active' : ''}`}
                    prefetch={false}
                  >
                    {collectionIcons[sub.slug] ?? <TbLayoutDashboard />}
                    <span className="nexalume-nav__link-label">{sub.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </>
      )}

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
