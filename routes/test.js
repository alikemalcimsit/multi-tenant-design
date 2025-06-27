import express from 'express'
const router = express.Router()

router.get('/', async (req, res) => {
  console.log('🚀 [Route] /test endpoint çağrıldı')
  try {
    console.log('📚 user tablosundan veri çekiliyor...')
    const users = await req.dbClient.user.findMany()
    console.log(`📦 ${users.length} kullanıcı bulundu.`)

    res.json(users)
  } catch (err) {
    console.error('❌ [Route] Veri çekme hatası:', err)
    res.status(500).json({ error: 'Query error', details: err.message })
  }
})

export default router
