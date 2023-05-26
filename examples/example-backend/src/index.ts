import { reclaimprotocol } from '@reclaimprotocol/reclaim-sdk'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import sqlite3, { Database } from 'sqlite3'

const singletonDb: Database | undefined = undefined


const getDb = async() => {
	if(singletonDb !== undefined) {
		return singletonDb
	}

	const db = new sqlite3.Database('/tmp/database.db', (err) => {
		if(err) {
			console.log('Could not connect to database.')
			console.error(err)
		}

		console.log('Connected to the database.')
	})

	db.run('CREATE TABLE IF NOT EXISTS reclaim (callback_id TEXT,status TEXT,reclaim_url TEXT,claims TEXT)')
	return db
}

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8000
const callbackUrl = process.env.CALLBACK_URL + '/callback/'

app.use(express.json())
app.use(cors())

const reclaim = new reclaimprotocol.Reclaim()

const request = reclaim.requestProofs(
	{
		title: 'Prove your reddit and google account',
		baseCallbackUrl: callbackUrl,
		requestedProofs: [
			new reclaim.HttpsProvider({
				name: 'Reddit',
				logoUrl: 'https://i.redd.it/snoovatar/avatars/97178518-5ce1-400b-8185-54dcaef96d9c.png',
				url: 'https://www.reddit.com/',
				loginUrl: 'https://www.reddit.com/login/?dest=https%3A%2F%2Fwww.reddit.com%2F',
				loginCookies: ['session', 'reddit_session', 'loid', 'token_v2', 'edgebucket'],
				selectionRegex: '<span class=\"_2BMnTatQ5gjKGK5OWROgaG\">{{username}}</span>.*?<span>{{karma}} karma</span>'
			}),
			new reclaim.CustomProvider({
				provider: 'google-login',
				payload: {}
			})
		]
	}
)

app.get('/', (req: Request, res: Response) => {
	res.send('Hello World!')
})

app.get('/request', async(req: Request, res: Response) => {
	const db = await getDb()

	const callbackId = request.callbackId
	const reclaimUrl = request.reclaimUrl

	try {
		db.run('INSERT INTO reclaim(callback_id,status,reclaim_url) VALUES(?,?,?)', [callbackId, 'pending', reclaimUrl], function(err) {
			if(err) {
				return console.error(err)
			  }

			  // get the last insert id
			  console.log(`A row has been inserted with rowid ${this.lastID}`)
		})
	} catch(e) {
		res.send(`500 - Internal Server Error - ${e}`)
		return
	}

	res.json({ reclaimUrl, callbackId })
})

app.post('/callback/:id', async(req: Request, res: Response) => {

	console.log('Got callback for id: ' + req.params.id)

	const db = await getDb()

	if(!req.params.id) {
		res.send('400 - Bad Request: callbackId is required')
		return
	}

	if(!req.body.proofs) {
		res.send('400 - Bad Request: claims are required')
		return
	}

	const callbackId = req.params.id

	const proofs = { claims: req.body.proofs }

	try {
		db.run('UPDATE reclaim SET claims=?,status=? WHERE callback_id = ?;', [JSON.stringify(proofs), 'verified', callbackId], function(err) {
			if(err) {
				console.log('error', err)
				return console.error(err)
			  }

			  // get the last insert id
			  console.log(`Row(s) updated: ${this.changes}`)
		})
		console.log('updated')
	} catch(e) {
		console.log('error', e)
		res.send(`500 - Internal Server Error - ${e}`)
		return
	}

	res.send('200 - OK')

})

app.get('/status/:callbackId', async(req: Request, res: Response) => {

	const db = await getDb()

	let row

	if(!req.params.callbackId) {
		res.send('400 - Bad Request: callbackId is required')
		return
	}

	const callbackId = req.params.callbackId
	console.log('callbackId', callbackId)
	try {
		row = db.all('SELECT status status FROM reclaim WHERE callback_id=?', [callbackId], (err, rows) => {
			if(err) {
			  throw err
			}

			rows.forEach((row) => {
			  console.log(row.status)
			})
		})
	} catch(e) {
		res.send(`500 - Internal Server Error - ${e}`)
		return
	}

	res.json({ status: row.get('status') })

})

process.on('uncaughtException', (err) => {
	console.log('Caught exception: ', err)
})

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`)
})