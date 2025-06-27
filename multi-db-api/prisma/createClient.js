import { PrismaClient } from '@prisma/client'

export const createClient = (dbName) => {
  console.log(`🛠️  PrismaClient oluşturuluyor: DB = ${dbName}`)
  return new PrismaClient({
    datasources: {
      db: {
        url: `mysql://root:12345@localhost:3306/${dbName}`
      }
    }
  })
}
