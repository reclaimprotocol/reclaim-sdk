import { utils, Wallet } from 'ethers'
import { computeAddress, computePublicKey } from 'ethers/lib/utils'
import { createSignDataForClaim } from './sign-data'
import { AnyClaimInfo, ServiceSignatureProvider } from './types'

export const signatures: ServiceSignatureProvider = {
	getPublicKey(privateKey) {
		const pub = computePublicKey(privateKey, true)
		return utils.arrayify(pub)
	},
	getAddress(publicKey) {
		return computeAddress(publicKey).toLowerCase()
	},
	async sign(data, privateKey) {
		const wallet = getEthWallet(privateKey)
		const signature = await wallet.signMessage(data)
		return utils.arrayify(signature)
	},
	async verify(data, signature, addressBytes) {
		const address = typeof addressBytes === 'string'
			? addressBytes
			: utils.hexlify(addressBytes)
		const signerAddress = utils.verifyMessage(data, signature)
		return signerAddress.toLowerCase() === address.toLowerCase()
	}
}

function getEthWallet(privateKey: string) {
	if(!privateKey) {
		throw new Error('Private key missing')
	}

	return new Wallet(privateKey)
}

const DEFAULT_MINT_EXPIRY_M = 15

/**
 * Authorise "requestor" to create a claim for "me"
 * using the given application data
 * @param me wallet who will own the credential
 * @param requestor wallet that will actually talk to the SC
 * @param data info about the credential to mint
 */
export async function authoriseWalletForClaimCreation(
	me: Wallet,
	requestor: string,
	data: AnyClaimInfo
) {
	const expiryMs = Date.now() + (DEFAULT_MINT_EXPIRY_M * 60 * 1000)
	const serialised = createSignDataForClaim({
		...data,
		owner: requestor.toLowerCase(),
		timestampS: Math.floor(expiryMs / 1000),
		epoch: 0,
	})
	const signature = await signatures.sign(Buffer.from(serialised), me.privateKey)

	return { signature, expiryMs }
}