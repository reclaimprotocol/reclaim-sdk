# Reclaim-SDK
The Reclaim SDK provides a way to let your users import data from other websites into your app in a secure, privacy preserving manner using zero knowledge proofs. 

## Introduction
The goal of the SDK is to allow you, the developer to easily integrate [Reclaim Protocol](https://questbook.gitbook.io/reclaim-protocol/)
 into your application that require that your users submit proof of the data that they own on other websites. For example, the you can ask your user for a proof that they have contributed to a GitHub repo, or they are an YC alumni, or they have a certain bank balance in their account without revealing any other PII like their name, physical address, phone number etc.

The platforms that have the data that your user needs to prove are called Providers. In the example stated above, GitHub, YC, bank's website are all Providers (provider of the data to be proved).

## Providers
Following are the default providers that you can start using right away:
- **GitHub**: To prove GitHub commits or pull requests by your user
- **YCombinator**: To prove that your user is a YC alumni
- **Google**: To prove that your user is an owner of a certain google account

But if your application require a certain Provider that is not listed above. You can create your own Provider using one of the following methods:

- **HTTPS Provider**: Use this provider when the data exists in plain text on a webpage and needs to be extracted. This usually means extracting the text from a particular html element on a particular webpage.

  The providers developed using this method are available explicitly for your application. They would not show up on the Reclaim app as one of the default providers. 
- **Custom Provider**: Use this provider If the data doesn't exist as is in any html element and requires some additional compute, for example counting the number of transactions or summing some values on the page - the logic needs to be embedded in a custom provider.
  
  The providers developed using this method are available for other applications to use them as well. They appear on the Reclaim app as one of the default providers. 

## Install
```
npm i @reclaimprotocol/reclaim-sdk
```

## Getting started
To connect to Reclaim Protocol instantiate Reclaim class and call `connect` method to connect your application. The method accepts the application name, the provider that will be used to create the claim and callback URL.

```
import { reclaimprotocol } from '@reclaimprotocol/reclaim-sdk'

const reclaim = new reclaimprotocol.Reclaim()
const connection = reclaim.connect(
  'Google proof',
  [
    {
      provider: 'google-login',
      payload: {},
      templateClaimId: reclaimprotocol.utils.generateUuid(),
    }
  ],
  callbackUrl // callbackUrl is triggered when user submits the claim on Reclaim app
)

```
### Check the proofs
Once the user has submitted the proofs on your application, you need to verify if the proofs that were submitted are coming from an authenticate source and have not been fudged. To verify the correctness of the proof, use the function `verifyCorrectnessOfProofs()` from the SDK. The function returns `true` if the verification is successful else `false`:

```
await reclaim.verifyCorrectnessOfProofs(proofs)
```

## Use HTTPS Provider

### Accept user data
You'd typically need the user to first fill up some information about themselves before you ask them to prove something about themselves.

For example, if you're airdropping a token to all the alumni of Acme Corp - you first let the user put in their name and wallet address. In the next screen, you ask them to prove that they're an alumus of Acme Corp.

```
<form action="/register" method="POST">
  Name : <input name="name"/> 
  <br />
  Employee Id: <input name="empid"/>
  Wallet address : <input name="address" />
  <br />
  <input type="submit" value="Next >" />
</form>
```

When the user submits the form, create a session and store it in a db. Provide the user a URL to initiate a proof

```
import { reclaimprotocol } from '@reclaimprotocol/reclaim-sdk'

const uuid = require(uuid);

router.post('/register', async (req, res) => {
  const sessionId = uuid.v4();
  await db.store({ ...req.body, sessionId });
  const callbackUrl = 'https://myhost.org/callback/'
  const template = buildTemplate(callbackUrl);
  // ... 
});
```

### Build a template
The callback URL is where the user will have to upload the proof once they've generated it. Now let's look at the function buildTemplate this is where we'll define what information we need from Acme Corp's website, along with a tamper resistance proof.

```
function buildTemplate(callbackUrl) {
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
                responseSelections: [
                    {
                        responseMatch:'<span id=\"empid\">{{EMPID}}</span>'
                    }
                  ],
                parameters: { 
                  EMPID: "<employee id of the user>" // key used is same as the variable used in responseMatch
                                                     // the value is the data to be proved by the user
                }
          },
      templateClaimId: uuid.v4(), // id for each claim for tracking if relevant proofs have been submitted by the user
      }
    ],
    callbackUrl
  );

  const template = (await connection).generateTemplate(sessionId);
}
```

The tricky part is to find the cookies that need to be set. 

A good way to figure this out is to look at the Application Tab in the Chrome debugger and look for cookies. You can also look at the Network calls tab to identify which cookies are really being used. 

This requires a little bit of reverse engineering or trial and error.

Trick : 
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

### Show the template to the user
```
router.post('/register', async (req, res) => {
  //...
  res.render('register', { url: template.url });
});
```

We recommend showing the URL as a QR code on the desktop and as a link on mobile. 

The user needs to open template.url on their Reclaim Wallet Mobile App. If they don't have the app installed template.url will guide them to install the app first.

At this stage, the user will generate the proof for the requested claims and hit submit. Hitting submit from the Reclaim Wallet Mobile App will upload the proof to the callback url that we had provided.

Check the correctness of the proof as mentioned [here](#check-the-proofs)

## Examples
Check the [examples](/examples/) folder to run a sample project using Reclaim-sdk
