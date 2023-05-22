---
description: Let your users import data from other websites into your app
---

# Using the Reclaim SDK

### Introduction

The **Reclaim SDK** provides a way to let your users import data from other websites into your app in a secure, privacy preserving manner using zero knowledge proofs.&#x20;

The goal of the SDK is to allow you, the developer, to easily integrate Reclaim Protocol into your application and ask users to import data from other websites. \


To import data from a website, we must define a **Provider** for that website.

### Providers

Following are the default providers that you can start using right away:

* **GitHub:** To prove GitHub commits or pull requests by your user
* **YCombinator:** To prove that your user is a YC alumni
* **Google:** To prove that your user is an owner of a certain google account

But if your application require a certain Provider that is not listed above. You can create your own Provider using one of the following methods:

* **HTTPS Provider:** Use this provider type when the data exists in plain text on a webpage and needs to be extracted. This usually means extracting the text from a particular html element on a particular webpage. Search is performed on a HTTPS response, no computation involved.\
  The providers of this type are available only for your application. They would not show up on the Reclaim Wallet as one of the default providers.&#x20;
* **Custom Provider:** Use this provider type if the data doesn't exist as is in any html element and requires some additional compute, for example counting the number of transactions or summing some values on the page - the logic needs to be embedded in a custom provider.\
  The providers developed using this method are available for other applications to use them as well. They appear on the Reclaim app as one of the default providers.&#x20;

