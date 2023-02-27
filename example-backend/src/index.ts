import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Reclaim, generateTemplateId } from '@questbook/template-client-sdk';
import { Pool } from 'pg'
import cors from 'cors';
import { verifyEncryptedClaims } from '@questbook/reclaim-crypto-sdk';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;
const dbPort = parseInt(process.env.DB_PORT ?? '5432')
const callbackUrl = process.env.CALLBACK_URL!

app.use(express.json())
app.use(cors())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

const reclaim = new Reclaim(callbackUrl);

const connection = reclaim.getConsent(
  'Questbook-Employee',
  [
    {
      provider: "google-login",
      params: { }
    }
  ]
)

app.get('/home', async (req: Request, res: Response) => {
  
  const callbackId = 'user-' + generateTemplateId();

  const url = connection.generateTemplate(callbackId).url;
  
  await pool.query("INSERT INTO submitted_links (callback_id, status) VALUES ($1, $2)", [callbackId, "pending"])
  
  res.json({ url, callbackId });
});

app.post('/callback/:id', async (req: Request, res: Response) => {

  const { id: callbackId } = req.params;

  const claims = { claims: req.body.claims };

  const verifiedClaimProofs = connection.verifyEncryptedClaimProofs(claims);

  await pool.query("UPDATE submitted_links SET claims = $2 AND status = $3 WHERE callback_id = $1;", [callbackId, verifiedClaimProofs, 'verified'])

  res.send("200 - OK")

});

app.get('/status/:callbackId', async (req: Request, res: Response) => {

  const { callbackId } = req.params;

  const statuses = await pool.query("SELECT status FROM submitted_links WHERE callback_id = $1", [callbackId])

  res.json({ status: statuses.rows[0].status })

});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});