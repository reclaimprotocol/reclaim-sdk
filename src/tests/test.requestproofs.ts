import { reclaimprotocol } from '..'

describe('Create proof request', () => {
	it('should correctly create proof request', () => {
		const reclaim = new reclaimprotocol.Reclaim()
		const request = reclaim.requestProofs(
			{
				title: 'Proof of Reddit Karma',
				baseCallbackUrl: 'https://www.google.com/',
				requestedProofs: [
					new reclaim.HttpsProvider({
						name: 'Reddit',
						logoUrl: 'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png',
						url: 'https://www.reddit.com',
						loginUrl: 'https://www.reddit.com/login',
						loginCookies: ['cookie1', 'cookie2'],
						selectionRegex: '<span class=\“_2BMnTatQ5gjKGK5OWROgaG\“>{{username}}</span>.*?<span>{{karma}} karma</span>',
					}),

					new reclaim.CustomProvider({
						provider: 'google-login',
						payload: {}
					}),
				]
			}
		)

		expect(request.template.name).toBe('Proof of Reddit Karma')
		expect(request.template.claims.length).toEqual(2)
	})
})