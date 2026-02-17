import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-12 max-w-5xl mx-auto">
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-4xl font-bold font-heading text-center md:text-5xl lg:text-6xl">
          {!user && (
            <span className="gradient-highlight-text">Bem-vindo ao Nexa Lume</span>
          )}
          {user && (
            <>
              Olá, <span className="gradient-highlight-text">{user.email}</span>
            </>
          )}
        </h1>
        <p className="mt-4 text-muted-foreground text-center">
          Plataforma de gestão Nexa Lume Digital
        </p>
        <div className="mt-8 flex items-center gap-3">
          <a
            className="btn-gradient rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Painel Admin
          </a>
          <a
            className="neon-border-cyan rounded-lg px-5 py-2.5 text-sm font-medium text-foreground transition-all"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentação
          </a>
        </div>
      </div>
    </div>
  )
}
