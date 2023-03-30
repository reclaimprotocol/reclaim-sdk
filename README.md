# Reclaim-SDK
The SDK to integrate third party applications with [Reclaim Protocol](https://questbook.gitbook.io/reclaim-protocol/)


## Install
```
npm i @reclaimprotocol/reclaim-sdk
```

## Getting started
To connect to Reclaim Protocol instantiate Reclaim class and call `connect` method to connect your application. `connect` method accepts the application name and the provider that will be used to create the claim.

Check the providers available [here](/src/types/index.ts)

```
// callbackUrl is triggered when user submits the claim on Reclaim app
const reclaim = new Reclaim(callbackUrl)
const connection = reclaim.connect(
  'application name',
  [
    {
      provider: 'google-login',
      params: {}
    }
  ]
)

```

## Example

Check the [examples](/examples/) folder to run a sample project using Reclaim-sdk