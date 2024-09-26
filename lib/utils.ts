export function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

type FormDataValues = Record<string, FormDataEntryValue | FormDataEntryValue[]>
export function getFormDataValues(data: FormData) {
	const result: FormDataValues = {}
	for (const [key, value] of data.entries()) {
		let existing = result[key]
		if (existing != null) {
			if (Array.isArray(existing)) {
				result[key] = [...existing, value]
			} else {
				result[key] = [existing, value]
			}
		} else {
			result[key] = value
		}
	}
	return result
}
