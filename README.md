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


Check the [examples](/examples/) folder to run a sample project using Reclaim-sdk
