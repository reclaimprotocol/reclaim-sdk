import { utils, Wallet } from 'ethers'
import { Claim, ClaimProof, EncryptedClaimProof } from '../crypto/types'
import { decryptData, encryptData, } from '../utils'
import {
	createSignDataForClaim,
	encryptClaimProof,
	hashClaimInfo,
	signatures,
	verifyEncryptedClaims
} from '..'


describe('Crypto', () => {

	it('should encrypt & decrypt', () => {

		const alice = Wallet.createRandom()
		const bob = Wallet.createRandom()

		const data = Buffer.from('{"a":"123","b":123}', 'utf8')
		const ciphertext = encryptData(
			utils.arrayify(bob.publicKey),
			utils.arrayify(alice.privateKey),
			data
		)

		const plaintext = decryptData(
			utils.arrayify(bob.privateKey),
			utils.arrayify(alice.publicKey),
			ciphertext
		)
		expect(Buffer.from(plaintext)).toEqual(data)
	})

	it('should verify encrypted claims', async() => {
		const alice = Wallet.createRandom()
		const bob = Wallet.createRandom()
		const witness = Wallet.createRandom()
		const timestamp = Math.floor(Date.now() / 1000)
		const params = 'test@gmail.com'
		const claimInfo = {
			provider:'google-login',
			context:'abc',
			parameters:params,
		}
		const claimIdentifier = hashClaimInfo(claimInfo)
		const data = createSignDataForClaim({
			identifier: claimIdentifier,
			timestampS: timestamp,
			owner:alice.address.toLowerCase(),
			epoch: 1
		})

		const sig = await signatures.sign(Buffer.from(data), witness.privateKey)

		const proof: ClaimProof = {
			parameters:params,
			signatures:[sig]
		}

		const encProof = encryptClaimProof(utils.arrayify(bob.publicKey), utils.arrayify(alice.privateKey), proof)

		const eProof: EncryptedClaimProof = {
			identifier: claimIdentifier,
			enc:encProof
		}

		const claim: Claim = {
			identifier: claimIdentifier,
			ownerPublicKey:await signatures.getPublicKey(alice.privateKey),
			provider:'google-login',
			redactedParameters:'****@gmail.com',
			timestampS: timestamp,
			witnessAddresses:[witness.address.toLowerCase()],
			context:'abc',
			epoch: 1,
		}

		verifyEncryptedClaims([claim], [eProof], utils.arrayify(bob.privateKey))
	})
})
