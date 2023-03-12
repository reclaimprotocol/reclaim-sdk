# Running the examples

## Build the template sdk

```
cd /template-client-sdk
npm install
npm run build
```

## Run the backend 
```
cd example-backend
```
### Note your server IP
```
$ ifconfig
```

### Edit `.env`
```
PORT=8000
CALLBACK_URL=http://<ip from ifconfig>:8000
```
### Run server
```
npm install
npm run build
npm run
```

## Run the frontend
(React project)
```
cd example-frontend
npm install
```
### Edit .env
```
REACT_APP_BACKEND_BASE_URL=http://<ip from ifconfig>:8000
```
### Run app server
```
npm start
```
Open app on http://localhost:3000

# Playing around
You'll need a mobile device with Reclaim Wallet Mobile App installed
Follow on screen instructions

All the data and proofs are stored at `/tmp/databases.db`

You can view the proofs and status of each form : 
```
$ sqlite3 /tmp/databases.db
sqlite3> select * from submitted_links;
```

Proofs are updated in the DB only when submitted correctly from the app :)