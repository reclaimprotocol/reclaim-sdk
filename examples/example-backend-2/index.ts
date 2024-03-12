// import cors from 'cors'
// import dotenv from 'dotenv'
// import express, { Express, Request, Response } from 'express'

import { Reclaim } from '@reclaimprotocol/js-sdk'
import cors from 'cors'
//import crypto from 'crypto'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'

dotenv.config()
const app: Express = express()
const port = process.env.PORT || 8000
//const callbackUrl = process.env.CALLBACK_URL + '/callback/'

app.use(express.json())
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})

app.get('/request', async (_, res: Response) => {
    const APP_ID = '0xaDC7C420ef0259972d44929dBCA3De1fbd7ef70D'

    const reclaimClient = new Reclaim.ProofRequest(
        APP_ID //TODO: replace with your applicationI
    )

    const providerIds = [
        '5f83ab14-9656-4552-9fbc-482e07022766', // Amazon 2023 Order Count
    ]

    await reclaimClient.buildProofRequest(providerIds[0])

    const APP_SECRET = '0xe4176ead9c383e0ee3cda8679ea66e7e76eb874a5d962fbd990a1d736ca50147'

    reclaimClient.setSignature(
        await reclaimClient.generateSignature(
            APP_SECRET //TODO : replace with your APP_SECRET
        )
    )

    const { requestUrl, statusUrl } = await reclaimClient.createVerificationRequest()
    res.send({ reclaimUrl: requestUrl, statusUrl })

})
