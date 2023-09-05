import { utils, Wallet } from 'ethers'
import { signatures } from './signatures'
import { AuthToken } from './types'

export const AUTH_TOKEN_EXPIRY_S = 60 * 60

/**
 * Decode and verify auth token
 * @param auth the auth token
 * @returns authorised user data
 */
export function authenticate(auth: string): AuthToken {
	const [plaintextB64, signatureB64] = auth.split('.')
	const plaintext = Buffer.from(plaintextB64, 'base64url')
	const signature = Buffer.from(signatureB64, 'base64url')
	const meId = utils.verifyMessage(plaintext, signature)
	const token: AuthToken = JSON.parse(plaintext.toString('utf-8'))
	if(typeof token !== 'object') {
		throw new Error('Invalid token')
	}

	const { id, expiresAtS } = token

	if(typeof id !== 'string' || typeof expiresAtS !== 'number') {
		throw new Error('Invalid token data')
	}

	if(meId.toLowerCase() !== token.id.toLowerCase()) {
		throw new Error('Token signature/wallet mismatch')
	}

	if(token.expiresAtS < unixTimestampSeconds()) {
		throw new Error('Token expired')
	}

	return { id, expiresAtS }
}

/**
 * Generates a 1-hour valid auth token
 * @param privateKey the 0x hex prefixed standard eth private key
 * @param expiryS the expiry time for the token in seconds
 * @returns auth token for that key
 */
export async function generateAuthToken(privateKey: string, expiryS = AUTH_TOKEN_EXPIRY_S): Promise<string> {
	const wallet = new Wallet(privateKey)
	const data = JSON.stringify({
		id: wallet.address.toLowerCase(),
		expiresAtS: unixTimestampSeconds() + expiryS
	})
	const encodedData = Buffer.from(data)

	const sig = await signatures.sign(encodedData, privateKey)
	const encodedSig = Buffer.from(utils.arrayify(sig))

	return encodedData.toString('base64url')
		+ '.'
		+ encodedSig.toString('base64url')
}

function unixTimestampSeconds() {
	return Math.floor(Date.now() / 1000)
}