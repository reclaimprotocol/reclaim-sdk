import { v4 as uuidv4 } from 'uuid'

export function generateUuid() {
	return uuidv4()
}

function isValidUrl(url: string) {
	try {
	  new URL(url)
	  return true
	} catch(err) {
	  return false
	}
}

export function generateCallbackUrl(baseUrl: string, callbackId?: string) {
	// check if valid url
	if(!isValidUrl(baseUrl)) {
		throw new Error('Invalid URL')
	}

	const id = callbackId ? callbackId : generateUuid()

	//check for trailing slash
	if(baseUrl.endsWith('/')) {
		// remove trailing slash
		baseUrl = baseUrl.slice(0, -1)
	}

	return `${baseUrl}?callbackId=${id}`
}

export function getCallbackIdFromUrl(_url: string): string {
	// check if valid url
	if(!isValidUrl(_url)) {
		throw new Error('Invalid URL')
	}

	const url = new URL(_url)
	const urlParams = new URLSearchParams(url.search)
	const callbackId = urlParams.get('callbackId')
	if(!callbackId) {
		throw new Error('Callback Id not found in URL')
	} else {
		return callbackId
	}
}

export async function getShortenedUrl(url: string) {
	// const headers = new Headers()
	// headers.append('Content-Type', 'application/json')
	const response = await fetch('https://rclm.link/short', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			fullUrl: url
		})
	})
	const res = await response.json()
	const shortenedVerificationUrl = res.shortUrl
	return shortenedVerificationUrl
}