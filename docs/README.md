---
description: Access users' data from any website - even if they don't have any APIs
---

# ⚡ Reclaim Protocol

### Introduction

Just as Plaid lets you pull your users' financial data from any banking website; Reclaim Protocol lets you pull your users' data from any website on the internet. Especially the ones that don't have APIs.&#x20;

The Reclaim SDK lets you embed an in-app browser. The user opens the webpage where you want to pull data from using a secure https connection on this in-app browser. The certificates that are used in establishing the secure connection are used to generate cryptographic proof of the data that was exchanged. None of the user data is visible to Reclaim's servers, it's all stored on the user's device.\
\
This data and the proof are then passed to you, to use however you need to in your business logic.

All of this happens without the need to make any modifications to the website you want to import data from.&#x20;

### Example usage of Reclaim protocol&#x20;

_For instance, if you are building a lending application for Uber drivers could leverage the Reclaim Protocol. Traditionally, obtaining the driver's rating from Uber's App for underwriting lending risks would be challenging as this information isn't accessible via an API. However, with the Reclaim Protocol, you can ask drivers to provide proof of their Uber ratings, allowing them to underwrite lending risks more accurately_ :sunglasses:

[**Check Reclaim Architecture**](readme/architecture.md) **🗼**

[**Get started 🚀**](developer/getting-started/)

**Welcome aboard the journey towards a self-sovereign future for user data** :tada:

