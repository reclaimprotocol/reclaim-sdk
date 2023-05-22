---
description: ZK Circuits are WIP
---

# ZK Proofs and Circuits

The witnesses keep track of the encrypted data that flows between the user and website.

The ZK Circuit has the following inputs

* Public : Encrypted data
* Public : Pattern to be matched in the HTML/XML/JSON data
* Private : decryption key provided by the user

Output

* Yes/No - whether the Pattern was found in the data (encrypted data decrypted by the private decryption key)

<figure><img src=".gitbook/assets/image (3).png" alt=""><figcaption><p>Reclaim Protocol ZK Circuit</p></figcaption></figure>

No information other than the fact that the pattern has been matched on the data or not is revealed.&#x20;

The encrypted blocks are attested by the witness

_**The ZK Proof is generated completely on the client side. The decryption key will never leave the user's device.**_

The current implementation of the Reclaim Protocol doesn't yet implement ZK Proofs, however it is in the works right now. Until then, the decryption key is sent to the Witness - but the witness cannot see the client secrets like username, password, auth tokens. Refer the whitepaper on the details of how this is possible.

{% content-ref url="whitepaper-and-how-reclaim-protocol-works.md" %}
[whitepaper-and-how-reclaim-protocol-works.md](whitepaper-and-how-reclaim-protocol-works.md)
{% endcontent-ref %}
