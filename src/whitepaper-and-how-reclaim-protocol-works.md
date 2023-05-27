# Whitepaper & How Reclaim Protocol Works

Reclaim protocol can prove the existence of user data on a website. User logs in into a website, and using the html/json response from the website Reclaim protocol generates a zk-proof.

## Participants

* Client : A mobile app that runs a custom implementation of TLS1.3, adhering to the full specs and without compromising any security of the protocol.&#x20;
* HTTPS Proxy : A transparent http proxy via which all the https requests are routed. This Proxy cannot read any contents of the request or the response.
* Server : The website server where the user data resides. The responses of the server are considered a ground truth.

## High level architecture

### Making a request

An authorized https request is created once the user is logged in, using Cookies. These cookies are responsible for identifying the user.

These cookies are private and should never be exposed to any other entity other than the server and the client.

A request is broken down into atleast 3 parts

1. Request preceeding the cookie string
2. The cookie string itself
3. Request succeeding the cookie string

Each of these parts are sent to the server with a fresh key. That is, the TLS 1.3 method `KeyUpdate` is invoked after each part is sent.&#x20;

The headers of the request are then revealed to the HTTPS Proxy for part 1 & 3. The Proxy will be able to attest that the correct request was sent, without the client revealing the cookie string

### What does the HTTPS Proxy do?

The HTTPS Proxy acts as a transparent proxy. It just forwards the request & response as is. However, it also stores the encrypted data for later use.&#x20;

### Processing the response

Once the request and response is completed, as defined by the `CloseSession` method, the proof generation begins.

The HTTPS Proxy first attests that the correct request was sent, as was expected for generating the proof.

The client will then run a zk circuit on client side.

The inputs for this circuit are

* Encrypted data
* Public certificate (SSL Certificate) used by the server
* Signature from the HTTPS Proxy that this is the correct encrypted data
* The data to look for (string match) in the response, once decrypted

The private input to the circuit :

* Decryption keys. This is the TLS session keys that will be able to decrypt the encrypted response. Please note the decryption keys are fed to the zk circuit which runs on the client.&#x20;

## Trust Assumptions

* **Client App doesn't leak data**
  * The client app will be open sourced soon
  * The client app should not
    * Send the decryption keys to any participant, including the server
    * Send decrypted data to any other participant. The decryption and the string matching happens strictly inside a zk-circuit. Noone other than the client ever has access to the decrypted response.
* **The HTTPS Proxy doesn't read any data**
  * The request and response are strictly to be read only by the client and server. The HTTPS Proxy is incapable of reading the request and response because all of the data is HTTPS encrypted.
* **The server is the source of truth**
  * This protocol doesn't handle the cases where the client is capable of colluding direcly with the server (e.g. twitter.com)

## Flow Diagram

<figure><img src=".gitbook/assets/image (4).png" alt=""><figcaption></figcaption></figure>

v0.1 (Draft, WIP)

{% file src=".gitbook/assets/reclaim_protocol.pdf" %}
