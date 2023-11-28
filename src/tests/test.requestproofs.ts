import { ProofRequest, reclaimprotocol } from '..'

jest.setTimeout(15000)

describe('Create proof request without xpath', () => {
	it('should correctly create proof request', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const request = reclaim.requestProofs(
			REQUEST_PROOF_WITHOUT_XPATH
		)

		// console.log(await request.getReclaimUrl())

		expect(request.template.name).toBe('Proof of Reddit Karma')
		expect(request.template.claims.length).toEqual(1)
		// expect(request.callbackId).toBe('1234')
	})
})

describe('Create proof request with xpath', () => {
	it('should correctly create proof request', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const request = reclaim.requestProofs(
			REQUEST_PROOF_WITH_XPATH
		)

		expect(request.template.name).toBe('YC')
		expect(request.template.claims.length).toEqual(1)
		// expect(request.callbackId).toBe('1234')
		// console.log(await request.getReclaimUrl())
	})

	it('should correctly create proof request without xPath', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const request = reclaim.requestProofs(
			REQUEST_PROOF_WITHOUT_XPATH
		)

		// console.log(await request.getReclaimHandshakeUrl())

		expect(request.template.name).toBe('Proof of Reddit Karma')
		expect(request.template.claims.length).toEqual(1)
		// expect(request.callbackId).toBe('1234')
	})

	it('should correctly create proof request with jsonPath', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const request = reclaim.requestProofs(
			REQUEST_PROOF_WITH_JSONPATH_2
		)
		expect(request.template.name).toBe('Razor Pay Salary')
		expect(request.template.claims.length).toEqual(1)

		console.log('url --', await request.getReclaimUrl({ shortened: true }))
	})
})


const reclaim = new reclaimprotocol.Reclaim()

const REQUEST_PROOF_WITHOUT_XPATH: ProofRequest = {
	title: 'Proof of Reddit Karma',
	baseCallbackUrl: 'https://www.google.com/',
	callbackId: '1234',
	requestedProofs: [
		new reclaim.HttpsProvider({
			name: 'Reddit',
			method: 'GET',
			logoUrl: 'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png',
			url: 'https://www.reddit.com/',
			loginUrl: 'https://www.reddit.com/login',
			loginCookies: ['session', 'reddit_session', 'loid', 'token_v2', 'edgebucket'],
			responseSelection: [
				{
					jsonPath: '',
					'xPath': '//*[@id="email-collection-tooltip-id"]/span/span[2]',
					responseMatch: '<span class="Rz5N3cHNgTGZsIQJqBfgk">.*?<span>{{KARMA}} karma</span></span>'
				},
			],
			useZk: true,
		}),

		// new reclaim.CustomProvider({
		// 	provider: 'google-login',
		// 	payload: {}
		// }),
	]
}

const REQUEST_PROOF_WITH_XPATH = {
	title: 'YC',
	baseCallbackUrl: 'https://www.google.com/',
	callbackId: '1234',
	requestedProofs: [
		new reclaim.HttpsProvider({
			name: 'YC https provider',
			logoUrl: 'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png',
			url: 'https://bookface.ycombinator.com/home/',
			loginUrl: 'https://bookface.ycombinator.com/home',
			loginCookies: ['_sso.key'],
			responseSelection: [
				{
					'jsonPath': '$.currentUser',
					'xPath': "//*[@id='js-react-on-rails-context']",
					responseMatch:'\\{"id":{{YC_USER_ID}},.*?waas_admin.*?:{.*?}.*?:\\{.*?}.*?(?:full_name|first_name).*?}',
				},
			],
			useZk: true,
		}),
		// new reclaim.HttpsProvider({
		// 	name: 'YC https provider',
		// 	logoUrl: 'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png',
		// 	url: 'https://bookface.ycombinator.com/home',
		// 	loginUrl: 'https://bookface.ycombinator.com/home',
		// 	loginCookies: ['_sso.key'],
		// 	responseSelection: [
		// 		{
		// 			jsonPath:'$.currentUser',
		// 			responseMatch:'\\{"id":{{YC_USER_ID}},.*?waas_admin.*?:{.*?}.*?:\\{.*?}.*?(?:full_name|first_name).*?}',
		// 			xPath:"//script[@id='js-react-on-rails-context']"
		// 		},
		// 		{
		// 			jsonPath:'$.hasBookface',
		// 			responseMatch:'"hasBookface":true',
		// 			xPath:"//script[@data-component-name='BookfaceCsrApp']"
		// 		}
		// 	]
		// })
	]
}

// const REQUEST_PROOF_WITH_JSONPATH = {
// 	title: 'YC email id',
// 	baseCallbackUrl: 'https://example.com/',
// 	callbackId: '1234',
// 	requestedProofs: [
// 		new reclaim.HttpsProvider({
// 			name: 'YC company id',
// 			url: 'https://bookface.ycombinator.com/bookface_api/home/home_current_user.json',
// 			loginUrl: 'https://bookface.ycombinator.com/home',
// 			loginCookies: ['_sso.key'],
// 			logoUrl: 'https://dev.reclaimprotocol.org/assets/logo.png',
// 			responseSelection: [
// 				{
// 					jsonPath: '$.email',
// 					responseMatch: '.*email":"{{YC_EMAIL_ID}}".*'
// 				}
// 			],
// 			useZk: true,
// 		})
// 	]
// }

const REQUEST_PROOF_WITH_JSONPATH_2 = {
	title: 'Razor Pay Salary',
	baseCallbackUrl: 'http://localhost:3003/callback/',
	callbackId: 'ac424fc8-a0d5-4b89-bdce-f08563c8c134',
	requestedProofs: [
		new reclaim.HttpsProvider({
			name: 'Razorpay Salary',
			url: 'https://payroll.razorpay.com/v2/api/me',
			loginUrl: 'https://payroll.razorpay.com/login',
			loginCookies: ['opfinproduction'],
			headers: [
				{
				  'key': 'Accept',
				  'value': 'application/json',
				  'type': 'CONSTANT'
				},
				{
				  'key': 'Content-Type',
				  'value': 'application/json',
				  'type': 'CONSTANT'
				},
				{
				  'key': 'csrf',
				  'value': '',
				  'type': 'DYNAMIC'
				}
			  ],
			logoUrl: 'https://http-provider.s3.ap-south-1.amazonaws.com/razorpay-logo.jpeg',
			responseSelection: [
				{
					'xPath': '',
					'responseMatch': '"title":"{{CLAIM_DATA}}"',
					'jsonPath': '$.currentOrganization.employeeDetails.title'
				  }
			],
			useZk: true,
		})
	]
}