'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TbUsers, TbPhoto, TbLayoutDashboard, TbAddressBook, TbBriefcase } from 'react-icons/tb'

import './Dashboard.scss'

const collectionIcons: Record<string, React.ReactNode> = {
  users: <TbUsers />,
  media: <TbPhoto />,
  clients: <TbAddressBook />,
  services: <TbBriefcase />,
}

type CardItem = {
  description: string
  href: string
  label: string
  slug: string
}

type CollectionCardsClientProps = {
  items: CardItem[]
}

export const CollectionCardsClient: React.FC<CollectionCardsClientProps> = ({ items }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="dashboard-cards">
      <h2 className="dashboard-cards__title">Itens de Menu</h2>
      <div className="dashboard-cards__grid">
        {items.map((item, index) => (
          <Link
            key={item.slug}
            href={item.href}
            className="dashboard-cards__item"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            prefetch={false}
          >
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.span
                  className="dashboard-cards__highlight"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                />
              )}
            </AnimatePresence>
            <div className="dashboard-cards__card">
              <div className="dashboard-cards__card-content">
                <div className="dashboard-cards__card-icon">
                  {collectionIcons[item.slug] ?? <TbLayoutDashboard />}
                </div>
                <h4 className="dashboard-cards__card-title">{item.label}</h4>
                <p className="dashboard-cards__card-description">{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
