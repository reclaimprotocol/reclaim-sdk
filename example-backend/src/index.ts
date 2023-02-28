import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Reclaim, generateTemplateId } from '@questbook/template-client-sdk';
import { Pool } from 'pg'
import cors from 'cors';
import { verifyEncryptedClaims } from '@questbook/reclaim-crypto-sdk';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;
const callbackUrl = process.env.CALLBACK_URL! + 'callback/'

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

  const url = (await connection).generateTemplate(callbackId).url;

  try {
    await pool.query("INSERT INTO submitted_links (callback_id, status) VALUES ($1, $2)", [callbackId, "pending"])
  }
  catch (e){
    res.send(`500 - Internal Server Error - ${e}`)
  }
  
  res.json({ url, callbackId });
});

app.post('/callback/:id', async (req: Request, res: Response) => {

  if(!req.params.id){
    res.send(`400 - Bad Request: callbackId is required`)
    return
  }

  if(!req.body.claims){
    res.send(`400 - Bad Request: claims are required`)
    return
  }

  const callbackId = req.body.id;
  const claims = { claims: req.body.claims };

  try{
    const results = await pool.query("SELECT callback_id FROM submitted_links WHERE callback_id = $1", [callbackId]);
    if(results.rows.length === 0){
      res.send(`404 - Not Found: callbackId not found`)
      return
    }
  }
  catch (e) {
    res.send(`500 - Internal Server Error - ${e}`)
    return
  }

  try {
    await pool.query("UPDATE submitted_links SET claims = $1, status = $2 WHERE callback_id = $3;", [JSON.stringify(claims), 'verified', callbackId])
  }
  catch (e){
    res.send(`500 - Internal Server Error - ${e}`)
  }

  res.send("200 - OK")

});

app.get('/status/:callbackId', async (req: Request, res: Response) => {
  let statuses;
  
  if(!req.params.callbackId){
    res.send(`400 - Bad Request: callbackId is required`)
    return
  }

  const callbackId = req.params.callbackId;

  try{
    const results = await pool.query("SELECT callback_id FROM submitted_links WHERE callback_id = $1", [callbackId]);
    if(results.rows.length === 0){
      res.send(`404 - Not Found: callbackId not found`)
      return
    }
  }
  catch (e) {
    res.send(`500 - Internal Server Error - ${e}`)
    return
  }

  try {
    statuses = await pool.query("SELECT status FROM submitted_links WHERE callback_id = $1", [callbackId])
  }
  catch (e){
    res.send(`500 - Internal Server Error - ${e}`)
    return
  }

  res.json({ status: statuses?.rows[0]?.status })

});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});