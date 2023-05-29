---
description: Export data from any website into a zkproof
---

# What is Reclaim Protocol

Using Reclaim Protocol you can export user-data from any website and generate a zkproof for it. This proof generation is completely trustless and privacy preserving.&#x20;

For example, a user can login into Bank Of America and generate a proof of their bank balance. In doing so, they aren't sharing their username, password or any authentication token to any party - unlike what Plaid does. Plaid takes the username password of the user and stores it in their database, arguably in plaintext.&#x20;

We can generate the proof for any data on any website without needing any change from the said website. So, Bank of America doesn't need to make any change for us to be able to generate the proof of bank balance.&#x20;

More importantly, Bank of America _**cannot**_ stop a user from exporting this data from their website. This is because Reclaim Protocol uses the TLS session keys to generate the proofs. That means, if the website wants to stop you from exporting this data and generating a proof for it, they'll have to change the TLS Protocol, making their website incompatible with all the web browsers in the world. TLS protocol is what powers HTTPS.&#x20;

This puts the user in control of their data. They are reclaiming their data from websites' databases. This data is rightfully theirs and should have sovereignty over how and where this data is used.

All the pieces of reclaim protocol are completely open-sourced. You're welcome to fork, contribute or lurk.&#x20;

## Demo!

{% embed url="https://www.loom.com/share/5f497f8b0a5342d3b6e43dc35d2b41fd" %}

