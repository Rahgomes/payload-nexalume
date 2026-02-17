import React from 'react'
import { Inter, Roboto_Condensed } from 'next/font/google'
import { QueryProvider } from '@/providers/QueryProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

export const metadata = {
  title: 'Nexa Lume',
  description: 'Plataforma de gestão Nexa Lume Digital',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${robotoCondensed.variable}`}>
        <QueryProvider>
          <ThemeProvider>
            <main>{children}</main>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
