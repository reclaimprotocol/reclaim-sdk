# UX Considerations

Here are a couple of important factors to keep in mind when using the Reclaim Protocol:

1. **Reclaim Wallet Installation**: To enable users to generate proofs using the Reclaim Protocol, they need to have a Reclaim Wallet installed. They can choose to install the app provided by the Reclaim Protocol team, build their own app using the Reclaim Wallet App's source code, or use a community-maintained app or browser extension. It's important to note that this additional installation is required to allow the app or extension to modify the TLS session data transfer by calling KeyUpdate and ensuring that sensitive information remains encrypted.
2. **Proof Generation Time**: The process of generating proofs typically takes around 35 seconds. It's essential to be aware of this time delay and take it into account when designing the user interface and user experience. Factors that contribute to the overall time include on-chain transactions (currently utilizing Optimism Goerli) and ZK proof generation. As a developer, it is recommended to design your application's flow and provide appropriate user feedback to manage user expectations during the proof generation process.

\
