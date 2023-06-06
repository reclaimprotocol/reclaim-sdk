# What is Reclaim Protocol

## Introduction to Reclaim Protocol

Reclaim protocol lets users generate proofs of user data from any website. These proofs are stored on chain with primitives for storing, retrieving, selectively revealing the proofs. Thus providing self sovereignty over user data. These proofs are guarantees of integrity and authenticity of user data. It requires no change from existing websites for Reclaim Protocol to allow users to create these proofs.

## Problem-Solving with Reclaim Protocol

Today, Reclaim Protocol addresses two key issues:

1. **Data Export & Import:** Users can log into a website, generate a zero-knowledge (zk) proof of their user data, and securely share this proof with other users and apps, independent of APIs or OAuth availability on the website.
2. **On-Chain Data Proofs:** Users can create proofs of their web2 user data for on-chain use, thereby integrating web2 data with decentralized platforms.

***

## Intended Users of Reclaim Protocol

Reclaim Protocol is specifically designed for developers and entrepreneurs looking to leverage user data stuck in websites' walled gardens and create innovative solutions.

### Required Skills and Knowledge Areas

Developers intending to use the Reclaim Protocol should be able to identify the kind of data that can be exported using Reclaim Protocol, and what applications can be built using these proofs. A mix of developer thinking and product thinking.&#x20;

On the technical end, this requires a understanding of full-stack development in JavaScript/TypeScript and familiarity with web technologies for basic reverse engineering tasks.&#x20;

### Application Examples

For instance, a developer aiming to build a lending application for Uber drivers could leverage the Reclaim Protocol. Traditionally, obtaining the driver's rating from Uber's App for underwriting lending risks would be challenging as this information isn't accessible via an API. However, with the Reclaim Protocol, developers can ask drivers to provide proofs of their Uber ratings, allowing them to underwrite lending risks more accurately.

### Target Industries

The Reclaim Protocol can be particularly advantageous in industries and fields such as:

* KYC (Know Your Customer)
* Professional Credentials Verification
* Creator Economy
* Payments
* Ecommerce
* Generative AI

These industries often involve dealing with user data within walled gardens, and the Reclaim Protocol enables more efficient, secure access to and usage of this data.

You can look for inspiration on [what to build here](what-to-build/).

## Main Features of Reclaim Protocol

The principal features of Reclaim Protocol are:

1. **Zero-Knowledge Proof Generation:** In the initial phase, users can generate a zero-knowledge proof (zkproof) of user data from any website.
2. **Proof Verification:** The generated proofs can be easily verified by any party.
3. **Use of TLS Session Keys:** Reclaim Protocol employs TLS session keys, which underpin HTTPS, to generate proofs, providing an added layer of security and privacy.

***

## Reclaim Protocol Architecture

Reclaim Protocol comprises three parts:

1. **The App:** The app incorporates an in-app browser with a modified TLS library that enables users to generate zk proofs of exchanged data without disclosing sensitive information.
2. **The Node:** Nodes maintain the ledger and act as an HTTP proxy, verifying the authenticity of the data exchanged between the user and the website.
3. **The zk Circuit:** The zk circuit checks whether a regex match is present decrypted data, using the encrypted data (public input), decryption key (private input), and the regex (public input).

As the protocol expands, it will integrate additional components to accommodate a greater variety of truths.

\


{% embed url="https://www.loom.com/share/5f497f8b0a5342d3b6e43dc35d2b41fd" %}
