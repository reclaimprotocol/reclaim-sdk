import canonicalize from 'canonicalize'
import { utils } from 'ethers'
import { Context } from '../types'

export function encodeContext(ctx: Context, fromProof: boolean): string {
	const context: Context = {
		contextMessage: !fromProof ? utils.keccak256(utils.toUtf8Bytes(ctx.contextMessage)) : ctx.contextMessage,
		contextAddress: ctx.contextAddress,
		sessionId: ctx.sessionId,
	}
	return canonicalize(context)!
}

export function decodeContext(ctx: string): Context {
	const context: Context = JSON.parse(ctx)
	// context.contextMessage = utils.toUtf8String(context.contextMessage)
	return context
}