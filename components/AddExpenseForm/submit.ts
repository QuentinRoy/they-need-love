"use server"

import * as v from "valibot"
import { store } from "@lib/store/store"
import { auth } from "@lib/auth"

const schema = v.object({
	title: v.string(),
	amount: v.pipe(
		v.string(),
		v.transform((x) => parseFloat(x)),
	),
	creditor: v.string(),
	date: v.pipe(
		v.string(),
		v.isoTimestamp(),
		v.transform((x) => new Date(x)),
	),
	description: v.optional(v.string()),
	attachments: v.optional(
		v.pipe(
			v.union([v.array(v.file()), v.file()]),
			v.transform((x): File[] => (Array.isArray(x) ? x : [x])),
		),
	),
})

export async function submit(data: FormData) {
	const { user } = auth()
	if (user == null) {
		return { success: false as const, errors: ["Not authenticated"] }
	}
	const rawData = Object.fromEntries(data.entries())
	let result = v.safeParse(schema, rawData)
	if (!result.success) {
		let errors = result.issues.map((issue) => issue.message)
		return { success: false as const, errors }
	}
	const { attachments, ...operation } = result.output
	const { id: operationId } = await store.addOperation({
		...operation,
		type: "expense",
	})
	return { success: true as const, operationId }
}
