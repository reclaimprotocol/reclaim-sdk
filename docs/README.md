# What is Reclaim Protocol

## Introduction to Reclaim Protocol

Reclaim Protocol is a protocol that facilitates the management of truths on a blockchain. Users have the ability to store their truths, which can be revealed to selected parties. The protocol provides functionalities to commit, store, retrieve, reveal, and verify these truths, ensuring the data remains resilient against censorship. While the initial phase focuses on generating proofs from websites using HTTPS, future phases will encompass a broader range of truths.

***

## Purpose of Reclaim Protocol

Reclaim Protocol is designed to provide users full control over their truths using blockchain technology and cryptographic proofs. The protocol's purpose in its initial phase is to facilitate users in transitioning their data from websites into their own custody, thereby providing self-sovereignty over their truths. These truths, stored on-chain, can be managed and selectively revealed by users, backed by the unaltered state and guaranteed authenticity of their data. As the protocol advances, it will support a wider array of truths, further empowering users in managing their truths.

***

## Problem-Solving with Reclaim Protocol

Today, Reclaim Protocol addresses two key issues:

1. **Data Exportation:** Users can log into a website, generate a zero-knowledge (zk) proof of their user data, and securely share this proof, independent of APIs or OAuth availability on the platform.
2. **On-Chain Data Proofs:** Users can create proofs of their web2 user data for on-chain use, thereby integrating web2 data with decentralized platforms.

As the protocol develops, it will adapt to address a broader range of challenges related to truth management.

***

## Intended Users of Reclaim Protocol

Reclaim Protocol is specifically designed for developers and entrepreneurs looking to leverage user data stuck in websites' walled gardens and create innovative solutions.

### Required Skills and Knowledge Areas

Developers intending to use the Reclaim Protocol should be able to envision the kind of data trapped within websites and figure out how to extract these proofs. This requires a solid understanding of full-stack development in JavaScript/TypeScript and familiarity with web technologies for basic reverse engineering tasks. Understanding the potential applications built upon the availability of such proofs is also crucial.

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
