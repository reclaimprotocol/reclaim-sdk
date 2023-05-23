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
To connect to Reclaim Protocol instantiate Reclaim class and call `requestProofs` method to request proofs from your users. The method accepts objects of type `ProofRequest` defined [here](src/types/index.ts)

```
import { reclaimprotocol } from '@reclaimprotocol/reclaim-sdk'

const reclaim = new reclaimprotocol.Reclaim()
const request = reclaim.requestProofs(
  {
    title: "Prove you're an Acme Corp Alum",
    baseCallbackUrl: "https://baseurl.com/path",
    requestedProofs: [
      new reclaim.HttpsProvider({
        name: "Acme Corp Emp Id",
        logoUrl: "https://acmecorp.com/logo.png",
        url: "https://acmecorp.com/myprofile",
        loginUrl: "https://acmecorp.com/login",
        loginCookies: ['authToken', 'ssid'],
        selectionRegex: "<span id='empid'>{{empid}}</span>",
    }),
    new reclaim.CustomProvider({
	    provider: 'google-login',
	    payload: {}
    }),
    ...
  ]
);
const url = request.reclaimUrl
const callbackId = request.callbackId()

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

router.post('/register', async (req, res) => {
  const sessionId = reclaimprotocol.utils.generateUuid();
  await db.store({ ...req.body, sessionId });
  const callbackUrl = 'https://myhost.org/callback/'
  const request = createRequest(callbackUrl, sessionId);
  // ... 
});
```

### Build a template
The callback URL is where the user will have to upload the proof once they've generated it. Now let's look at the function buildTemplate this is where we'll define what information we need from Acme Corp's website, along with a tamper resistance proof.

```
function createRequest(callbackUrl, sessionId) {
  const reclaim = new reclaimprotocol.Reclaim()
  const request = reclaim.requestProofs(
  {
    title: "Prove you're an Acme Corp Alum",
    baseCallbackUrl: "https://baseurl.com/path",
    requestedProofs: [
      new reclaim.HttpsProvider({
        name: "Acme Corp Emp Id",
        logoUrl: "https://acmecorp.com/logo.png",
        url: "https://acmecorp.com/myprofile",
        loginUrl: "https://acmecorp.com/login",
        loginCookies: ['authToken', 'ssid'],
        selectionRegex: "<span id='empid'>{{empid}}</span>",
    }),
    ...
  ]
);
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
  const callbackId = request.callbackId // store this callbackId with other user information. It will be later used to update proofs for a user
  res.render('register', { url: request.reclaimUrl });
});
```

We recommend showing the URL as a QR code on the desktop and as a link on mobile. 

The user needs to open template.url on their Reclaim Wallet Mobile App. If they don't have the app installed template.url will guide them to install the app first.

At this stage, the user will generate the proof for the requested claims and hit submit. Hitting submit from the Reclaim Wallet Mobile App will upload the proof to the callback url that we had provided.

Check the correctness of the proof as mentioned [here](#check-the-proofs)

## Examples
Check the [examples](/examples/) folder to run a sample project using Reclaim-sdk
