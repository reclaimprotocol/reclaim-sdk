# Trust Assumptions

When you receive a proof on the Reclaim Wallet app, you are trusting the following

## Correct proof generation configuration

Proof generation configurations are available as&#x20;

1. HTTPS Providers
2. Custom Providers

You trust that the configuration used for generating the proof accurately reflects your requirements in the proof. You can view the view the sourcecode of the configuration here :&#x20;

* [HTTPS Providers ](https://marketplace.reclaimprotocol.org)
* [Custom Providers](https://comingsoon.com)

## Honest behaviour by website

Every provider generates proofs based on the responses received from the website mentioned in the configuration. For example, the Reddit Karma HTTPS Provider uses the response from reddit.com to generate a proof of the Reddit Karma of the user. By trusting the Reclaim Proof, you trust that the website, that is reddit.com, didn't collude with the user to change the response just for the duration of the proof generation.&#x20;

## Honest behaviour by atleast 1 Node

You trust that atleast 1 node in the Reclaim protocol acts honestly to generate a proof.

If one node is acting correctly, it can whistle blow the other malicious nodes and cause a slashing of their stake. However, if all the nodes have colluded and are malicious, the proof is not safe to trust.

More details of the Slashing mechanism and security can be found in the whitepaper. (Coming soon)



## Correct execution of proof construction by the app

Proof construction involves multiple steps

1. Verifying signatures from the Nodes
2. Feeding the inputs to the ZK circuit after the above verification
3. Executing the zk circuits

## Correct execution of zk circuits

You trust the zk circuit implementations are accurate. You can see the [sourcecode of the circuits here](https://github.com/reclaimprotocol/zk). You trust that these proofs correctly decrypt the encrypted data within the zk circuit.&#x20;

You also trust the correct inputs have been provided to the zk circuits

This includes

* Encrypted data
* Signatures provided by the nodes

These can be verified since they're public inputs.

## App that you've installed

You also trust that the app you've installed is one you trust. If you have downloaded the app from the playstore or appstore, you trust the entity uploading the app to the stores to have uploaded exactly the app as referenced by the [sourcecode](https://github.com/reclaimprotocol/app).



