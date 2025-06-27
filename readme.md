![alt text]({4BE95D46-A258-44C4-A264-8E118DB31B81}.png)


![alt text]({68DBAB86-AFE9-461B-A24F-949389470E81}.png)


![alt text]({3022AB59-D953-4EF3-8736-AD2D15DE8CED}.png)



![alt text]({1FA4A7AB-776F-4ACF-A64C-C4881A7E8E29}.png)



![alt text]({F78130F7-CD37-4E27-9913-55A2E496B2E3}.png)

![alt text]({23F17F8E-614E-4066-8A87-C353AA56F9D6}.png)

![alt text]({05AA15EA-F13B-4512-A8C2-7D6DB8C2043E}.png)


![alt text]({7BFE4F0C-1766-47D7-ACC4-BCD6F2EB4FFA}.png)



#########################################################################

##05AA15EA For Controll With Caching System



import { PrismaClient as HospitalClient } from '../prisma/generated/crmpanel_hospital/index.js'
import { createClient } from '../prisma/createClient.js'

const hospitalClient = new HospitalClient()

const clientCache = {}

export const domainMiddleware = async (req, res, next) => {
  const domain = req.headers['x-domain']
  if (!domain) {
    return res.status(400).json({ error: 'x-domain header is required' })
  }

  try {
    // cache kontrolü
    if (clientCache[domain]) {
      req.db = clientCache[domain]
      return next()
    }

    const hospital = await hospitalClient.hospital.findFirst({ where: { domain } })
    if (!hospital) {
      return res.status(404).json({ error: 'Domain not found' })
    }

    const client = createClient(hospital.db_name)
    clientCache[domain] = client
    req.db = client
    next()
  } catch (err) {
    next(err)
  }
}
