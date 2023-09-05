import { Wallet } from 'ethers'
import { authenticate, generateAuthToken } from '../crypto'

describe('Auth', () => {


	it('should validate token', async() => {

		const acc = Wallet.createRandom()

		const token = await generateAuthToken(acc.privateKey)

		const usr = authenticate(token)
		expect(usr.id.toLowerCase()).toEqual(acc.address.toLowerCase())
	})
})

