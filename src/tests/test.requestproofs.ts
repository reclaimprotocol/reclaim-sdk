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
	})

	it('should correctly create proof request for swiggy', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const request = reclaim.requestProofs(
			REQUEST_PROOF_SWIGGY
		)
		expect(request.template.name).toBe('Swiggy')
		expect(request.template.claims.length).toEqual(1)
		console.log(await request.getReclaimUrl())
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
			urlType: 'CONSTANT',
			loginUrl: 'https://www.reddit.com/login',
			responseSelection: [
				{
					jsonPath: '',
					'xPath': '//*[@id="email-collection-tooltip-id"]/span/span[2]',
					responseMatch: '<span class="Rz5N3cHNgTGZsIQJqBfgk">.*?<span>{{KARMA}} karma</span></span>'
				},
			],
			useZK: true,
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
			urlType: 'CONSTANT',
			loginUrl: 'https://bookface.ycombinator.com/home',
			loginCookies: ['_sso.key'],
			responseSelection: [
				{
					'jsonPath': '$.currentUser',
					'xPath': "//*[@id='js-react-on-rails-context']",
					responseMatch:'\\{"id":{{YC_USER_ID}},.*?waas_admin.*?:{.*?}.*?:\\{.*?}.*?(?:full_name|first_name).*?}',
				},
			],
			useZK: true,
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

const REQUEST_PROOF_SWIGGY = {
	title: 'Swiggy',
	baseCallbackUrl: 'https://api.reclaimprotocol.org/',
	callbackId: 'sweta-swiggy',
	requestedProofs: [
		new reclaim.HttpsProvider({
			name: 'Swiggy https provider',
			logoUrl: 'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png',
			url: 'https://www.swiggy.com/dapi/order/all\\\\?order_id=',
			loginUrl: 'https://www.swiggy.com/auth',
			responseSelection: [
				{
					'xPath': '',
					'responseMatch': '"restaurant_name":"{{restaurant_1}}"',
					'jsonPath': '$.data.orders[0].restaurant_name'
				  },
				  {
					'xPath': '',
					'responseMatch': '"name":"{{restaurant_1_order_item_name}}"',
					'jsonPath': '$.data.orders[0].order_items[0].name'
				  },
				  {
					'xPath': '',
					'responseMatch': '"category_details":{{restaurant_1_order_category}}',
					'jsonPath': '$.data.orders[0].order_items[0].category_details'
				  },
				  {
					'xPath': '',
					'responseMatch': '"order_total":{{res_1_amount_paid}}',
					'jsonPath': '$.data.orders[0].order_total'
				  },
				  {
					'xPath': '',
					'responseMatch': '"restaurant_name":"{{restaurant_2}}"',
					'jsonPath': '$.data.orders[1].restaurant_name'
				  },
				  {
					'xPath': '',
					'responseMatch': '"name":"{{restaurant_2_order_item_name}}"',
					'jsonPath': '$.data.orders[1].order_items[0].name'
				  },
				  {
					'xPath': '',
					'responseMatch': '"category_details":{{restaurant_2_order_category}}',
					'jsonPath': '$.data.orders[1].order_items[0].category_details'
				  },
				  {
					'xPath': '',
					'responseMatch': '"order_total":{{res_2_amount_paid}}',
					'jsonPath': '$.data.orders[1].order_total'
				  }
			],
			useZK: true,
			customInjection: "window.getCookie = function(name) {var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));if (match) return match[2];};setInterval(() => {if(getCookie('_is_logged_in')&& window.location.href === 'https://www.swiggy.com/' && !window.rcnav){window.rcnav = true;  window.location.href = 'https://www.swiggy.com/my-account/';}},1000);"
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
// 			useZK: true,
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
			urlType: 'CONSTANT',
			logoUrl: 'https://http-provider.s3.ap-south-1.amazonaws.com/razorpay-logo.jpeg',
			responseSelection: [
				{
					'xPath': '',
					'responseMatch': '"title":"{{CLAIM_DATA}}"',
					'jsonPath': '$.currentOrganization.employeeDetails.title'
				  }
			],
			useZK: true,
		})
	]
}