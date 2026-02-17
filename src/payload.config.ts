import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { pt } from '@payloadcms/translations/languages/pt'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Services } from './collections/Services'
import { Clients } from './collections/Clients'
import { MediaCategories } from './collections/MediaCategories'
import { Media } from './collections/Media'
import { WhatsappCampaigns } from './collections/WhatsappCampaigns'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  i18n: {
    fallbackLanguage: 'pt',
    supportedLanguages: { pt },
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' | Nexa Lume',
    },
    components: {
      Nav: '@/components/admin/Nav#CustomNav',
      views: {
        dashboard: {
          Component:
            '@/components/admin/Dashboard/CollectionCards#CustomCollectionCards',
        },
      },
    },
  },
  routes: {
    admin: '/painel',
  },
  collections: [Users, Services, Clients, MediaCategories, Media, WhatsappCampaigns],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: true,
    prodMigrations: [],
  }),
  sharp,
  plugins: [],
})
