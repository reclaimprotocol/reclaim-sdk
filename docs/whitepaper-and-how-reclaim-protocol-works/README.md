# How Reclaim Protocol Works

## Components

The Reclaim Protocol empowers users to self-custody their truths by generating proofs of website data. The protocol operates through the following components:

#### 1. The App

The Reclaim Protocol app includes an in-app browser that acts as a gateway for users. It routes all user traffic through an HTTP proxy, which serves as a node on the Reclaim Protocol network. The app formats HTTPS requests to preserve privacy and enable later generation of zero-knowledge (zk) proofs. The app can be developed by adhering to the protocol's specifications.

#### 2. The Node

Nodes in the Reclaim Protocol fulfill two primary functions. They maintain a ledger tracking initiated, completed, and failed proof generation processes. Additionally, nodes act as HTTP proxies for requests from the app. They sign two critical pieces of information: confirmation of the correct app request and the receipt of encrypted data (E) from the website. Nodes ensure the integrity and authenticity of the exchanged data during proof generation.

#### 3. The ZK Circuit

The ZK Circuit generates zk proofs using encrypted data and node signatures. It demonstrates the correct decryption of specific encrypted data parts without revealing the private decryption key. This approach ensures privacy by decrypting only the necessary webpage portion, keeping other confidential information undisclosed.

## Proof Generation Process

The Reclaim Protocol enables users to generate proofs of specific information from websites using a step-by-step process. Here's an overview of the proof generation process:

1. **Provider Selection**: Users choose a provider configuration to generate the desired proof. This configuration includes the URL of the website, the data to be extracted, and extraction instructions.
2.  **In-App Browser**: Users log into the website and navigate to the page containing the required data using the Reclaim Protocol app's in-app browser. The app breaks down the request into three parts:

    * **Part 1**: The portion before the authentication tokens.
    * **Part 2**: The authentication tokens (e.g., passwords, auth tokens).
    * **Part 3**: The portion after the tokens.

    Each part is encrypted using an independent session key, ensuring the privacy and confidentiality of the authentication tokens. The authentication tokens are never revealed to any party other than the user themselves.
3. **Claim Creation**: Before sending the request, the app creates a claim on the blockchain, containing the selected provider and provider parameters. The claim transaction returns a unique claim ID and assigns nodes responsible for facilitating the request.
4. **Request and Response**: The app sends the request to the website via the assigned nodes, which act as HTTP proxies. These nodes function as common internet infrastructure, facilitating the communication between the app and the website while ensuring secure transmission of data.
5.  **Node Verification**: Once the session is terminated, the app reveals parts 1 and 3 of the request to the assigned nodes. By revealing these parts, the app provides the necessary information for the nodes to verify the correctness of the request, including the URL and the expected request body. Importantly, the authentication tokens (Part 2) are never revealed to any party other than the user, ensuring their confidentiality.

    The nodes witness the encrypted response from the website, but they cannot decrypt it. They compare the encryption keys used with those registered on a DNS Certificate Authority to ensure the response's integrity and authenticity.
6. **Node Signatures**: If the request and response pass the verification checks, the nodes sign the data, including the sent request and witnessed encrypted response. The signatures serve as proof of the correctness and authenticity of the exchanged data.
7. **Proof Generation**: The app downloads the signed data from the nodes and proceeds with proof generation. This process involves several steps:
   * The app locally decrypts the data and identifies the XPath of the HTML element containing the desired information.
   * It runs a zero-knowledge (zk) circuit to generate a proof of the element's existence in the encrypted response.
   * Another zk circuit is executed to generate a proof that the encrypted element decrypts to the desired plaintext without revealing the decryption key, which remains private.
   * The app assembles the proof, including the provider configuration, request, response, node signatures, zk proofs, and the regex mentioned in the provider configuration.
8. **Final Proof**: The proof includes a regex match on the plaintext element extracted from the response. It demonstrates the authenticity and integrity of the generated proof, ensuring that the desired information was correctly extracted from the website.

\


\
