# Data Security

Data security is a crucial aspect of the Reclaim Protocol and the HTTPS provider. The protocol takes measures to ensure that user data remains encrypted and secure during the process of proof generation and verification. Here's how data security is maintained:

* **TLS Encryption**: When a user utilizes the Reclaim Wallet in-app browser to generate proofs, the request is split into three parts: the request before the cookies and auth headers, the cookies and auth headers, and the request after the cookies and auth headers. After each part has been transmitted, the Reclaim Wallet sends a `KeyUpdate` TLS message to the server. The keys associated with the part that encrypts the cookies and auth tokens are not revealed to anyone when the app reveals the request to the node for signing. This ensures that users' private data remains private throughout the process.
* **Sensitive Data Protection**: The Reclaim Protocol is designed in a way that sensitive information, such as passwords or auth tokens, is not revealed during the proof generation process. The protocol focuses on extracting specific data points using cryptographic proofs without exposing the underlying sensitive data.

By implementing TLS encryption and carefully handling sensitive data, the Reclaim Protocol and the HTTPS provider maintain a high level of data security, ensuring that users' private information remains protected.

\
