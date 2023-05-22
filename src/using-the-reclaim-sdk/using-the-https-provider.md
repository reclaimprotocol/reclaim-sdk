# Using the HTTPS Provider

This guide assumes you will have a backend server running for your website/app. If that's not the case please visit [serverless-embed.md](serverless-embed.md "mention")

## Install the SDK

Install the Reclaim SDK from [node package](https://www.npmjs.com/package/@reclaimprotocol/reclaim-sdk)

```
npm install @reclaimprotocol/reclaim-sdk
```

## Accept user data

You'd typically need the user to first fill up some information about themselves before you ask them to prove something about themselves.

For example, if you're airdropping a token to all the alumni of Acme Corp - you first let the user put in their name and wallet address. In the next screen, you ask them to prove that they're an alum of Acme Corp.

```html
<form action="/register" method="POST">
  Name : <input name="name"/> 
  <br />
  Wallet address : <input name="address" />
  <br />
  <input type="submit" value="Next >" />
</form>
```

When the user submits the form, create a session and store it in a db. Provide the user a URL to initiate a proof

```javascript
import { reclaimprotocol } from '@reclaimprotocol/reclaim-sdk'

const uuid = require(uuid);

// Regex that will be used to extract information from the target website
const responseSelections = [
    {
        responseMatch:'<span id=\"empid\">{{EMPID}}</span>'
    }
]

router.post('/register', async (req, res) => {
  const sessionId = uuid.v4();
  await db.store({ ...req.body, sessionId });
  const callbackUrl = 'https://myhost.org/callback/'
  const template = buildTemplate(callbackUrl);
  // ... 
});
```

## Build a template

The callback URL is where the user will have to upload the proof once they've generated it. Now let's look at the function `buildTemplate` this is where we'll define what information we need from Acme Corp's website, along with a tamper resistance proof.

<pre class="language-javascript"><code class="lang-javascript">function buildTemplate(callbackUrl) {
  const reclaim = new reclaimprotocol.Reclaim()
  const connection = reclaim.connect(
    "Prove you're a Acme Corp Alum",  // a title that will be shown to the user
                                      // Good to mention what proof you're seeking

    [                                 // List of proofs you need from the user
      {
        provider: 'http',
        payload: {
                metadata: {
                  name: "Your Acme Corp EmpID", // What data you're extracting from the user's profile
                  logoUrl: "https://acmecorp.com/logo.png" 
                },
                url: 'https://acmecorp.com/myprofile', //URL which needs to be opened to extract information from 
                method: 'GET', // HTTP Method (Allowed : GET/POST)
                login: {
                  url: 'https://acmecorp.com/login', // Where should the user be redirected if they're not logged in to access the above mentioned URL
                  checkLoginCookies: ['authToken', 'ssid'], // Cookies that are set when a user is logged in
                },
                responseSelections: "&#x3C;span id='empid'>{{EMPID}}&#x3C;/span>", // defined globally above
                parameters: { 
                }
          },
      templateClaimId: uuid.v4(), // id for each claim for tracking if relevant proofs have been submitted by the user
      }
    ],
    callbackUrl
  );

<strong>  const template = connection.generateTemplate(sessionId);
</strong>}
</code></pre>

### Finding loginCookies

A good way to figure this out is to look at the Application Tab in the Chrome debugger and look for cookies. You can also look at the Network calls tab to identify which cookies are really being used.&#x20;

This requires a little bit of reverse engineering or trial and error.

Trick :&#x20;

1. Open the network tab on chrome
2. Open the URL
3. Login
4. In the network tab "Search" for some string like the empid or username
5. This will give you the network request that contained that information
6. Right click on the network request and copy as curl
7. Paste the curl command in your terminal
   1. Remove cookies one by one and run the curl
   2. If the curl still responds with the correct expected response, repeat 1
   3. If the curl responds with an access denied error, you should keep this cookie in the checkLoginCookies array and continue removing other cookies one by one.

### Response selections

The response selection matches the regular expression on the html response received from the website.&#x20;

The responseSelections field also allows you to define parameters using \{{VAR\_NAME\}} syntax.&#x20;

If your responseSelection string has a \{{VAR\_NAME\}} set, it will be matched using (.\*?) and stored in the variable VAR\_NAME.

The value of the VAR\_NAME will be available to you in the callback url payload.



## Show the template to the user

```javascript
router.post('/register', async (req, res) => {
  //...
  res.render('register', { url: template.url });
});
```

We recommend showing the URL as a QR code on the desktop and as a link on mobile.&#x20;

The user needs to open template.url on their Reclaim Wallet Mobile App. If they don't have the app installed template.url will guide them to install the app first.

At this stage, the user will generate the proof for the requested claims and hit submit. Hitting submit from the Reclaim Wallet Mobile App will upload the proof to the callback url that we had provided.

## Check the proof and extract the parameters proved

{% code overflow="wrap" %}
```
router.post('/callback/:sessionId', async (req, res) => {
const proofs = reclaimprotocol.utils.getProofsFromRequestBody(req.body)               

// extract the user information that was extracted using the https provider
let parameters:{[key: string]: string} = {}
for (const proof of proofs){
    const parametersExtracted = reclaimprotocol.utils.extractParameterValues(responseSelections, proof)
    parameters = {...parameters, ...parametersExtracted}
}

// verify if the proof submitted is legitimate
  if(await reclaim.verifyCorrectnessOfProofs(proofs)) {
    // Airdrop tokens!
  }
});
```
{% endcode %}

