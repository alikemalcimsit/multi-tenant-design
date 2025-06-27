import { PrismaClient as HospitalPrisma } from '../prisma/generated/crmpanel_hospital/index.js'
import { createClient } from '../prisma/createClient.js'

const hospitalPrisma = new HospitalPrisma()

export const domainMiddleware = async (req, res, next) => {
  const domain = req.headers['x-domain']

  console.log('\n📥 [Middleware] Yeni istek geldi.')
  console.log(`🌐 Header'dan alınan domain: ${domain}`)

  if (!domain) {
    console.error('❌ x-domain header bulunamadı!')
    return res.status(400).json({ error: 'x-domain header is required' })
  }

  try {
    console.log('🔍 Hospital tablosunda domain aranıyor...')
    const hospital = await hospitalPrisma.hospital.findFirst({
      where: { domain }
    })

    if (!hospital) {
      console.error(`❌ '${domain}' domainine ait kayıt bulunamadı!`)
      return res.status(404).json({ error: 'Hospital not found for domain' })
    }

    console.log(`✅ Domain eşleşti: '${domain}' → db_name: '${hospital.db_name}'`)

    console.log(`🧩 ${hospital.db_name} veritabanına bağlanmak için client oluşturuluyor...`)
    req.dbClient = createClient(hospital.db_name)
    console.log(`🔗 Client oluşturuldu. Sıradaki adım route işlemine geçmek.\n`)

    next()
  } catch (err) {
    console.error('💥 Middleware içi hata:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
