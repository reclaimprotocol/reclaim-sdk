
export const REDACTION_CHAR = '*'
export const REDACTION_CHAR_CODE = REDACTION_CHAR.charCodeAt(0)

/**
 * Check if a redacted string is congruent with the original string.
 * @param redacted the redacted content, redacted content is replaced by '*'
 * @param original the original content
 */
export function isRedactionCongruent<T extends string | Uint8Array>(redacted: T, original: T): boolean {
	for(let i = 0;i < redacted.length;i++) {
		const areSame = redacted[i] === original[i]
			|| (typeof redacted[i] === 'string' && redacted[i] === REDACTION_CHAR)
			|| (typeof redacted[i] === 'number' && redacted[i] === REDACTION_CHAR_CODE)
		if(!areSame) {
			return false
		}
	}

	return true
}

/**
 * Is the string fully redacted?
 */
export function isFullyRedacted<T extends string | Uint8Array>(redacted: T): boolean {
	for(let i = 0;i < redacted.length;i++) {
		if(
			redacted[i] !== REDACTION_CHAR
			&& redacted[i] !== REDACTION_CHAR_CODE
		) {
			return false
		}
	}

	return true
}