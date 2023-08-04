---
description: Reclaim Protocol
---

# 🗼 Architecture

### Reclaim Protocol Architecture

Reclaim Protocol comprises three parts:

1. **The App:** The app incorporates an in-app browser with a modified TLS library that enables users to generate zk proofs of exchanged data without disclosing sensitive information.
2. **The Node:** Nodes maintain the ledger and act as an HTTP proxy, verifying the authenticity of the data exchanged between the user and the website.
3. **The zk Circuit:** The zk circuit checks whether a regex match is present decrypted data, using the encrypted data (public input), decryption key (private input), and the regex (public input).

<figure><img src="../.gitbook/assets/image (2).png" alt=""><figcaption></figcaption></figure>
