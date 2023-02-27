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
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: dbPort
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

app.get('/reset', async (req: Request, res: Response) => {

  await pool.query(" \
    CREATE TABLE IF NOT EXISTS submitted_links ( \
      id SERIAL, \
      callback_id TEXT NOT NULL, \
      claims TEXT NULL); \
  ")

  await pool.query("TRUNCATE TABLE submitted_links");

  res.send('Reset Database');

});


app.get('/home', async (req: Request, res: Response) => {
  
  const callbackId = 'user-' + generateTemplateId();
  
  const url = (await connection).generateTemplate(callbackId).url;
  
  res.json({ url });
});

app.post('/callback/:id', async (req: Request, res: Response) => {

  const { id: callbackId } = req.params;

  const claims = req.body.claims;
  console.log(claims);
  await pool.query("INSERT INTO submitted_links (callback_id, claims) VALUES ($1, $2)", [callbackId, JSON.stringify(claims)])

  res.send("OK")

});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});