# Troubleshooting

## Common Errors

**"Root CA not found. Could not verify certificate"**

This means that the root CA for the domain you're trying to connect to has not been added to the reclaim node. We have the Mozilla root CA list by default, but if this error occurs, you'll need to add the root CA for the domain you're trying to connect to.

To add a root CA, follow these steps:

1. If you don't know what a root CA is, read [this](https://comodosslstore.com/resources/what-is-a-root-ca-certificate-and-how-do-i-download-it/)
2. Run `npm run verify-root-ca {host}`
   * `{host}` is the host you're trying to connect to, which results in the error
   *   At the end of the script, you'll see a log like:

       ```
        {"level":30,"time":1686473965567,"pid":8408,"hostname":"192.168.1.10","err":"Root CA not found. Could not verify certificate","rootIssuer":{"attributes":[{"type":"2.5.4.10","value":"Digital Signature Trust Co.","valueTagClass":19,"name":"organizationName","shortName":"O"},{"type":"2.5.4.3","value":"DST Root CA X3","valueTagClass":19,"name":"commonName","shortName":"CN"}],"hash":"6ff4684d4312d24862819cc02b3d472c1d8a2fa6"},"msg":"error in cert verify"}
       ```
   * Copy the `commonName` object from the log (`DST Root CA X3` in the above log). This is the name of the root CA.
3. Find the root CA certificate online using the name you copied
   * [http://www.certificate.fyicenter.com/](http://www.certificate.fyicenter.com/) is a good resource
4. Copy the certificate in PEM format
5. Paste in the `src/tls/root-ca.ts` file, in the `ROOT_CA_LIST` array
6. Run `npm run verify-root-ca {host}`. This time, it should succeed & you won't see an error at the bottom of the log

###

\
