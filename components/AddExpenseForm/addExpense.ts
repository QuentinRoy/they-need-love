"use server"

import * as v from "valibot"
import { redirect } from "next/navigation"
import { store } from "@lib/store/store"
import { getUser } from "@lib/auth"
import { revalidate } from "@lib/store/cache"
import { getFormDataValues } from "@lib/utils"

const schema = v.object({
	title: v.string("Title is required"),
	amount: v.pipe(
		v.string("Amount is required"),
		v.rawTransform(({ dataset, addIssue, NEVER }) => {
			try {
				return parseFloat(dataset.value)
			} catch {
				addIssue({ message: "Invalid amount" })
			}
			return NEVER
		}),
	),
	creditorId: v.pipe(v.string("Creditor is required"), v.brand("MemberId")),
	date: v.pipe(
		v.string("Date is required"),
		v.isoTimestamp("Invalid date"),
		v.transform((x) => new Date(x)),
	),
	description: v.optional(v.string()),
	attachments: v.optional(
		v.pipe(
			v.union([v.array(v.file()), v.file()], "Invalid attachments"),
			v.transform((x): File[] => (Array.isArray(x) ? x : [x])),
			// When nothing is selected, the file input still sends an empty file.
			// This filters out empty files.
			v.transform((x) => x.filter((f) => f.size > 0)),
		),
	),
})

type ParsedData = v.InferOutput<typeof schema>

export type AddExpenseState =
	| { status: "idle" }
	| {
			status: "error"
			errors: { message: string; key: null | keyof ParsedData | "$auth" }[]
	  }

export async function addExpense(
	_previousState: unknown,
	data: FormData,
): Promise<AddExpenseState> {
	const user = await getUser()
	if (user == null) {
		return {
			status: "error",
			errors: [
				{ message: "Authentication is required", key: "$auth" as const },
			],
		}
	}
	let result = v.safeParse(schema, getFormDataValues(data))
	if (!result.success) {
		let errors = result.issues.map((issue) => ({
			message: issue.message,
			key: issue.path?.[0].key as keyof ParsedData | null,
		}))
		return { status: "error", errors }
	}
	await store.addOperation({ ...result.output, type: "expense" })
	revalidate("expenses")
	redirect("/expenses")
}
