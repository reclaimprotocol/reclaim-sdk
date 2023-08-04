---
description: '@reclaimprotocol/reclaim-sdk'
---

# 🤍 Reclaim Core SDK

### Overview

Use Reclaim SDK in your backend server to request proofs from your user and verify proofs

### Prerequisites

* You have a node-based backend server in place. If not, click on the button below. It will create a backend repository with boilerplate code and deploy it on Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/reclaimprotocol/one-step-deploy-provider)&#x20;

* You are on the Node 18 version series or above. Check the node version using :point\_down:

```
node --version
```

* Download the latest Node version from [here](https://nodejs.org/en)&#x20;

_<mark style="color:orange;">The tutorial below uses Express backend</mark>_

### Install the SDK

```bash
npm i @reclaimprotocol/reclaim-sdk
```

### Import `reclaimprotocol` from Reclaim SDK

```javascript
/* index.js */
// 👇 import reclaimprotocol
import { reclaimprotocol } from '@reclaimprotocol/reclaim-sdk' 
import bodyParser from 'body-parser'
import express from "express";
import cors from 'cors';

const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json())
```

### Initialise Reclaim class

```javascript
/* index.js */
import { reclaimprotocol } from '@reclaimprotocol/reclaim-sdk'
import bodyParser from 'body-parser'
import express from "express";
import cors from 'cors';

const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json())

const reclaim = new reclaimprotocol.Reclaim()  // 👈 initialise Reclaim class
```

Once the class is initialised, we will see how to request proofs.

[Take me to Request proofs tutorial ->](request-proofs.md)
