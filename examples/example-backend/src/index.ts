import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Reclaim, generateUuid } from '@questbook/template-client-sdk';
import cors from 'cors';
import sqlite3, { Database } from 'sqlite3'
import { open } from 'sqlite'

let singletonDb : Database | undefined = undefined;


const getDb = async () => {
    if(singletonDb !== undefined)
      return singletonDb;
    const db = await open({
      filename: '/tmp/database.db',
      driver: sqlite3.cached.Database
    })
    await db.exec('CREATE TABLE IF NOT EXISTS submitted_links (callback_id TEXT, status TEXT, username TEXT, template_id TEXT, claims TEXT)');
    return db;
}

// import { verifyEncryptedClaims } from '@questbook/reclaim-crypto-sdk';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;
const callbackUrl = process.env.CALLBACK_URL! + '/callback/'

app.use(express.json())
app.use(cors())


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

app.get('/home/:username', async (req: Request, res: Response) => {
  const db = await getDb();

  const username = req.params.username;

  const callbackId = 'user-' + generateUuid();

  const template = (await connection).generateTemplate(callbackId);

  const url = template.url

  const templateId = template.id

  try {
    await db.run("INSERT INTO submitted_links (callback_id, status, username, template_id) VALUES (?, ?, ?, ?)", callbackId, "pending", username, templateId)
  }
  catch (e){
    res.send(`500 - Internal Server Error - ${e}`)
    return
  }
  
  res.json({ url, callbackId });
});

app.post('/callback/:id', async (req: Request, res: Response) => {

  console.log("Got callback for id: " + req.params.id);

  const db = await getDb();

  if(!req.params.id){
    res.send(`400 - Bad Request: callbackId is required`)
    return
  }

  if(!req.body.claims){
    res.send(`400 - Bad Request: claims are required`)
    return
  }

  const callbackId = req.params.id;

  const claims = { claims: req.body.claims };

  try {
    await db.run("UPDATE submitted_links SET claims = ?, status = ? WHERE callback_id = ?;", JSON.stringify(claims), 'verified', callbackId);
    console.log("updated");
  }
  catch (e){
    console.log("error", e);
    res.send(`500 - Internal Server Error - ${e}`)
    return
  }

  res.send("200 - OK")

});

app.get('/status/:callbackId', async (req: Request, res: Response) => {

  const db = await getDb();

  let row;
  
  if(!req.params.callbackId){
    res.send(`400 - Bad Request: callbackId is required`)
    return
  }

  const callbackId = req.params.callbackId;

  try {
    row = await db.get("SELECT status FROM submitted_links WHERE callback_id = $1", [callbackId])
  }
  catch (e){
    res.send(`500 - Internal Server Error - ${e}`)
    return
  }

  res.json({ status: row.status })

});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});