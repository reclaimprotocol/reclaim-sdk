# Integration - Advanced

_Note: Building a custom provider is not available publicly at this point. Please_ [_contact us_](https://t.me/abhilashinumella) _for getting access to the repository to build a custom provider_

### Introduction

Use this provider If the data doesn't exist as is in any html element and requires some additional compute, for example counting the number of transactions or summing some values on the page - the logic needs to be embedded in a custom provider.\
\
The providers developed using this method are available for other applications to use them as well. They appear on the Reclaim app as one of the default providers.

### Getting started

The provider needs to be added at two places - the **reclaim app** and the **witness node**.

1. Clone the [repository](https://github.com/questbook/tls-receipt-verifier)

```
git clone https://github.com/questbook/tls-receipt-verifier.git
```

2. Use the following guides to add the provider to the app and the node:

| Where to add provider? | Guide                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| **App**                | [README](https://github.com/questbook/tls-receipt-verifier/tree/main/credentials-wallet-mobile/src/providers) |
| **Node**               | [README](https://github.com/questbook/tls-receipt-verifier/tree/main/node)                                    |

3. Once added, raise a PR to the repository you just cloned above. Our team will review your PR and get the Provider live to production for you to use.
