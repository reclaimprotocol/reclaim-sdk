import { utils, Wallet } from 'ethers'
import { signatures } from '../crypto'

describe('Signatures', () => {

	it('should sign & verify', async() => {

		const alice = Wallet.createRandom()

		const data = Buffer.from('{"a":"123","b":123}', 'utf8')
		const signature = await signatures.sign(
			data,
			alice.privateKey,
		)

		const addr = signatures.getAddress(utils.arrayify(alice.publicKey))
		let res = await signatures.verify(data, signature, addr)

		expect(res).toBeTruthy()
		res = await signatures.verify(data, utils.hexlify(signature), addr)

		expect(res).toBeTruthy()
	})
})