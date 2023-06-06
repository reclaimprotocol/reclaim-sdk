---
description: ZK Circuits are WIP
---

# ZK Proofs and Circuits

### Why We Use ZK?

1. Reclaim uses TLS KeyUpdate messages to redact (from the witness) arbitrary pieces of text in the user's request to the server. For more details, see the [whitepaper](./).
2. This KeyUpdate approach does not work for the response sent from the server back to the user, as we cannot control when the server will send a KeyUpdate message to us
3. This meant that Reclaim could not redact text (from the witness) in the response, and would have to expose the entire TLS response to the witness to generate a claim
   * The above problem would prevent certain use cases where the response contains important information about the claim but simultaneously contains sensitive information that cannot be revealed to anybody else
4. To resolve the above problem, we need a method that generates a proof that a certain TLS encrypted packet received from the server, decrypts to a given packet without revealing any information about any other packet in the response

To tackle the above problem, we use a ZK circuit that proves the user knows the key to decrypt a given ciphertext block to a plaintext, without ever revealing the key itself

### How ZK & Reclaim Work Together

1. The user initiates the protocol via the witness -- makes the request to the server & waits for the response to be complete
2. The user then selects which slices of the response to actually reveal to the witness.
   1. For eg.
      1. If the server sends back the JSON: `{"userId":"1234","userSecret":"abcdefghi"}`
      2. The user doesn't want to reveal the key "userSecret" to the witness, instead just wants to send a valid JSON with the secret redacted to prove that they're in possession of some "userId"
      3. The user would select the slices (0,33), (42, 44)
         1. i.e `{"userId":"1234","userSecret":"`
         2. and `"}`
3. These slices are then normalised to the block sizes of the encryption scheme.
   * This is because all TLS1.3 supported symmetric encryption schemes (i.e. AES & ChaCha) use a standard block size.
   * So in order to select which blocks to reveal to the witness, we need to convert the slices to blocks of the encryption scheme
   * For eg.
     1. Assume our encryption scheme uses 8 byte blocks
     2.  Building from the above example, we'd reveal blocks:

         0 => `{"userId`

         1 => `":"1234"`

         2 => `,"userSe`

         3 => `cret":"a`

         5 => `"}` (assume padding after this)
4. Next, we further redact portions of blocks that need only be partially revealed. For eg.
   1. In the previous example, we revealed block 3 which contained a character from the secret
      1. `cret":"a` included "a"
      2. To prevent this secret reveal, we'd redact with a "\*" character
      3. `cret":"a` => `cret":"*`
      4. `We apply this transformation to the ciphertext as well, in preparation to input the ZK circuit`
   2.  One question that may arise is that a modified (due to redaction) ciphertext, when decrypted will lead to a garbage plaintext rather than a redacted one.

       1. This is correct for many encryption schemes but not for a [CBC](https://en.wikipedia.org/wiki/Block\_cipher\_mode\_of\_operation) based scheme -- which we use with TLS.
       2. In this scheme, we can modify portions of the ciphertext without leading to a completely non-sensical plaintext as the ciphertext is obtained by XORing a plaintext with a counter block.

       <figure><img src="../.gitbook/assets/1000px-GCM-Galois_Counter_Mode_with_IV.svg.png" alt="" width="375"><figcaption></figcaption></figure>

       1. For eg.
          1. if the ciphertext is originally some `qewojdja`
          2. By redacting the last char, it becomes `qewojdj*`
          3. Now, when put through the decryption scheme, the plaintext is obtained as `cret":"(`
          4. As one sees, the obtained plaintext is valid with only the last char being nonsensical -- which we can simply ignore as that was meant to be redacted
5. Now that we know which blocks to reveal, we build a ZK circuit with the following inputs:
   1. Redacted ciphertext (public input)
   2. Redacted decrypted ciphertext (public input)
      * this is the final content received after decrypting the redacted ciphertext, as mentioned in step 4
   3. The encryption key (private input)
6. User sends this compiled ZK circuit to the witness alongside the redacted ciphertext & plaintext
7. Witness now validates that the redacted ciphertext is indeed congruent with the ciphertext it actually observed being received from the server. For eg.
   1. if ciphertext is `qewojdja` and redacted ciphertext is `qewojdj*`
   2. witness checks that every character either matches or is replaced by a \*
8. Once the ciphertext is validated, witness feeds the public inputs & runs the ZK circuit. It verifies the circuit ran successfully & adds the block to the total TLS transcript
   1. From the example covered above, this transcript would look like `{"userId":"1234","userSecret":"****"}`
   2. Note: length of the redacted material isn't preserved in the transcript
9. Once verified, the witness passes the redacted plaintext of the TLS transcript to the claim provider to check if the TLS transcript does indeed contain the claim the user is trying to make

### Usage in HTTP Provider

Most of Reclaim's use cases centre around proving an HTTP server returned a response with some specific data. This is essentially:

* Authenticated API request via cookies or token
* Checking response contains a certain value at a certain JSON path or even x-path

For eg. someone may want to prove that they contributed to a GitHub repository -- this would involve making a request to GH's API with an authentication token and checking the response JSON contains the repository name.

#### Building a Generic Provider Using ZK

1. In order to generically claim data from an HTTP server, we'd need a user to provide the following parameters:
   1. URL --> full url with path, query for API
   2. HTTP Method -> GET, POST etc.
   3. Authentication -> how to authenticate the API -- cookies, token etc.
   4. Response redaction -> which portions of the response should be revealed to the witness
   5. Response match -> how to verify that the portions redacted actually match the expected value of the claim
2. Compiling this into a typescript schema, we get the following:
   1.  public parameters

       ```typescript
       type HTTPProviderParams = {
           /**
            * which URL does the request have to be made to
            * for eg. https://amazon.in/orders?q=abcd
            */
           url: string
           /** HTTP method */
           method: 'GET' | 'POST'
           /** which portions to select from a response. If both are set, then JSON path is taken after xPath is found */
           responseSelections: {
       		/**
       		 * expect an HTML response, and to contain a certain xpath
       		 * for eg. "/html/body/div.a1/div.a2/span.a5"
       		 */
       		xPath?: string
       		/**
       		 * expect a JSON response, retrieve the item at this path
       		 * using dot notation
       		 * for e.g. 'email.addresses.0'
       		 */
       		jsonPath?: string
       		/** A regexp to match the "responseSelection" to */
       		responseMatch: string
       	}[]
       }
       ```
   2.  secret parameters (only visible on user's side)

       ```typescript
       type HTTPProviderSecretParams = {
           /** cookie string for authorisation. Will be redacted from witness */
           cookieStr?: string
           /** authorisation header value. Will be redacted from witness */
           authorisationHeader?: string
       }
       ```
3.  Let's see how this could be used to make a GitHub claim:

    ```json
    {
    	"url":"https://api.github.com/search?q=repo:questbook/reclaim-sdk+author:@me",
    	"method": "GET",
    	"responseSelections": [
    		{
    			"jsonPath": "$.items[0].commit.repository.name",
    			"responseMatch": "questbook/reclaim-sdk"
    		}
    	]
    }
    ```
4. Let's see how the protocol processes this claim. When creating the claim:
   1. User takes the public parameters & secret parameters, formats them into an HTTP request. It also redacts the secrets from the request whether they're authorisation headers or cookies
   2. Once the response comes back from the server, user uses the jsonPath or the xPath to select indices of portions of the response that need to be revealed to the witness. These could be something like \[1,40], \[450,453] etc.
   3. User prepares ZK proofs for the redacted portions as described in the document above, and sends to witness.
      * Note: witness only receives the portions redacted by the user using the xpath/jsonPath -- it does not do the redaction itself
   4. On the witness's end, it verifies the http request sent by the user actually match the public parameters. That is, the user didn't build another HTTP request to claim A, when claiming access to B. For eg. we check if the URL in the parameters is "https://abcd.com/abcd", the user didn't make the request to some other arbitrary "https://abcd.com/efgh"
   5. Witness checks the ZK proofs are valid, and then runs the regexps provided in the public parameters on the redacted response. If the regexps match, the witness assumes the claim is valid and signs it
