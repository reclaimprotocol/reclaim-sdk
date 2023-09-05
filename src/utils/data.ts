import { createCipheriv, createDecipheriv } from 'crypto'
import { utils } from 'ethers'
import { SigningKey } from 'ethers/lib/utils'
import hkdf from 'futoin-hkdf'

const AUTH_TAG_LENGTH = 16

/**
 * Encrypts data using recipient's public key and sender's private key.
 * @param {Uint8Array} publicKey - Recipient public key in raw (un-hexed) form.
 * @param {Uint8Array} privateKey - Sender's private key in raw (un-hexed) form.
 * @param {Uint8Array} data - serialized data to encrypt
 */
export function encryptData(publicKey: Uint8Array, privateKey: Uint8Array, data: Uint8Array): Uint8Array {
	const { key, salt } = getKeyAndSalt(publicKey, privateKey)
	const cipher = createCipheriv('aes-256-gcm', key, salt, { authTagLength: AUTH_TAG_LENGTH })
	return Buffer.concat([
		cipher.update(data),
		cipher.final(),
		cipher.getAuthTag()
	])
}

/**
 * Decrypts data using sender's public key and recipient's private key.
 * @param {Uint8Array} privateKey - Recipient's private key in raw (un-hexed) form.
 * @param {Uint8Array} publicKey -Sender's public key in raw (un-hexed) form.
 * @param {Uint8Array} ciphertext - encrypted data
 */
/**
 * Decrypts data using sender's public key and recipient's private key.
 * @param {Uint8Array} privateKey - Recipient's private key in raw (un-hexed) form.
 * @param {Uint8Array} publicKey -Sender's public key in raw (un-hexed) form.
 * @param {Uint8Array} ciphertext - encrypted data
 */
export function decryptData(privateKey: Uint8Array, publicKey: Uint8Array, ciphertext: Uint8Array): Uint8Array {
	const { key, salt } = getKeyAndSalt(publicKey, privateKey)
	const decipher = createDecipheriv('aes-256-gcm', key, salt, { authTagLength: AUTH_TAG_LENGTH })
	decipher.setAuthTag(
		ciphertext.subarray(ciphertext.length - AUTH_TAG_LENGTH)
	)
	ciphertext = ciphertext.subarray(0, ciphertext.length - AUTH_TAG_LENGTH)

	return Buffer.concat([
		decipher.update(ciphertext),
		decipher.final()
	])
}

function getKeyAndSalt(publicKey: Uint8Array, privateKey: Uint8Array) {
	const sharedSecret = Buffer.from(
		utils.arrayify(new SigningKey(privateKey).computeSharedSecret(publicKey))
	)
	const key = hkdf(sharedSecret, 32, { salt: 'reclaim-key' })
	const salt = hkdf(sharedSecret, 12, { salt: 'reclaim-salt' })
	return { key, salt }
}

export function encodeBase64(str: string[][]) {
	return Buffer.from(JSON.stringify(str)).toString('base64')
}

export function decodeBase64(str: string) {
	return JSON.parse(Buffer.from(str, 'base64').toString('utf-8')) as string[][]
}
