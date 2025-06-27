![alt text]({4BE95D46-A258-44C4-A264-8E118DB31B81}.png)


![alt text]({68DBAB86-AFE9-461B-A24F-949389470E81}.png)


![alt text]({3022AB59-D953-4EF3-8736-AD2D15DE8CED}.png)



![alt text]({1FA4A7AB-776F-4ACF-A64C-C4881A7E8E29}.png)



![alt text]({F78130F7-CD37-4E27-9913-55A2E496B2E3}.png)

![alt text]({23F17F8E-614E-4066-8A87-C353AA56F9D6}.png)

![alt text]({05AA15EA-F13B-4512-A8C2-7D6DB8C2043E}.png)


![alt text]({7BFE4F0C-1766-47D7-ACC4-BCD6F2EB4FFA}.png)

# Multi-Tenant Dynamic Database API with Prisma & Node.js

Bu proje, gelen HTTP isteklerindeki `x-domain` header bilgisine göre ilgili tenant veritabanına dinamik olarak bağlanan ve Prisma ORM kullanan çok kiracılı (multi-tenant) bir Node.js API örneğidir.

---

## Özellikler

- Domain bazlı dinamik veritabanı bağlantısı  
- Prisma ORM ile güvenilir ve tip güvenli sorgular  
- Basit cache mekanizmasıyla performans optimizasyonu  
- Express.js tabanlı hızlı API geliştirme  
- Modüler middleware yapısı  

---

## Proje Yapısı Örneği

```
src/
├── app.js
├── middleware/
│   └── domainMiddleware.js
├── prisma/
│   ├── createClient.js
│   └── generated/
├── routes/
│   └── test.js
├── controllers/
└── services/
```

---

## Kurulum

1. Depoyu klonla:

```bash
git clone https://github.com/kullaniciadi/multi-db-api.git
cd multi-db-api
```

2. Bağımlılıkları yükle:

```bash
npm install
```

3. Ortam değişkenlerini ayarla (`.env`):

```env
DATABASE_URL_HOSPITAL="mysql://root:password@localhost:3306/crmpanel_hospital"
```

4. Prisma client’ları oluştur:

```bash
npx prisma generate
```

5. Server’ı başlat:

```bash
npm run dev
```

---

## Kullanım

API, gelen isteklerde **`x-domain`** header’ını bekler. Örnek istek:

```bash
curl -H "x-domain: crmpanel.tr" http://localhost:3000/test
```

Bu durumda:

- `crmpanel_hospital` veritabanındaki `hospital` tablosunda `domain = "crmpanel.tr"` aranır,
- Eşleşen kayıt varsa `db_name` bilgisi alınır,
- Bu `db_name` kullanılarak ilgili tenant veritabanına dinamik Prisma Client ile bağlanılır,
- Veritabanı sorguları bu client üzerinden çalıştırılır.

---

## Domain Middleware (Cache Destekli)

```js
import { PrismaClient as HospitalClient } from '../prisma/generated/crmpanel_hospital/index.js'
import { createClient } from '../prisma/createClient.js'

const hospitalClient = new HospitalClient()

// Basit client cache objesi
const clientCache = {}

export const domainMiddleware = async (req, res, next) => {
  const domain = req.headers['x-domain']

  if (!domain) {
    return res.status(400).json({ error: 'x-domain header is required' })
  }

  try {
    // Cache kontrolü
    if (clientCache[domain]) {
      req.db = clientCache[domain]
      return next()
    }

    // Domain'e ait hospital kaydı sorgula
    const hospital = await hospitalClient.hospital.findFirst({ where: { domain } })
    if (!hospital) {
      return res.status(404).json({ error: 'Domain not found' })
    }

    // Yeni client oluştur ve cache'e ekle
    const client = createClient(hospital.db_name)
    clientCache[domain] = client
    req.db = client

    next()
  } catch (err) {
    next(err)
  }
}
```

---

## createClient.js Örneği

```js
import { PrismaClient } from '@prisma/client'

export const createClient = (dbName) => {
  return new PrismaClient({
    datasources: {
      db: {
        url: `mysql://root:password@localhost:3306/${dbName}`
      }
    }
  })
}
```

> **Not:** `root:password` kısmını kendi MySQL kullanıcı bilgilerinle değiştir.

---

## İletişim & Katkı

Bu projeye katkı sağlamak veya sorun bildirmek için GitHub üzerinden iletişime geçebilirsiniz.

---

**İyi kodlamalar! 🚀**
