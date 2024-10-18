"use server"

import * as v from "valibot"
import { redirect } from "next/navigation"
import { auth } from "@lib/auth"
import { getFormDataValues } from "@lib/utils"
import { prisma } from "@lib/prisma"
import type { Prisma } from "@prisma/client"

const schema = v.objectAsync({
	name: v.string("Name is required"),
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
	creditorId: v.pipe(
		v.string("Creditor is required"),
		v.rawTransform(({ dataset, addIssue, NEVER }) => {
			try {
				return parseInt(dataset.value)
			} catch {
				addIssue({ message: "Invalid creditor id" })
			}
			return NEVER
		}),
	),
	date: v.pipe(
		v.string("Date is required"),
		v.isoTimestamp("Invalid date"),
		v.transform((x) => new Date(x)),
	),
	description: v.optional(v.string()),
	attachments: v.optionalAsync(
		v.pipeAsync(
			v.union([v.array(v.file()), v.file()], "Invalid attachments"),
			v.transform((x): File[] => (Array.isArray(x) ? x : [x])),
			// When nothing is selected, the file input still sends an empty file.
			// This filters out empty files.
			v.transform((x) => x.filter((f) => f.size > 0)),
			v.transformAsync((attachments) =>
				Promise.all(attachments?.map(fileToAttachment) ?? []),
			),
		),
	),
	type: v.optional(v.literal("expense", "Invalid operation type"), "expense"),
})
export type ParsedFormValue = v.InferOutput<typeof schema>
export type FormValue = v.InferInput<typeof schema>

export type AddExpenseState =
	| { status: "idle" }
	| {
			status: "error"
			errors: { message: string; key: null | keyof ParsedFormValue | "$auth" }[]
	  }

export async function addExpense(
	_previousState: AddExpenseState,
	formData: FormData,
): Promise<AddExpenseState> {
	const session = await auth()
	if (session == null) {
		return {
			status: "error",
			errors: [
				{ message: "Authentication is required", key: "$auth" as const },
			],
		}
	}
	if (session.member == null || session.workspace == null) {
		return {
			status: "error",
			errors: [
				{ message: "User has no associated member", key: "$auth" as const },
			],
		}
	}
	let result = await v.safeParseAsync(schema, getFormDataValues(formData))
	if (!result.success) {
		let errors = result.issues.map((issue) => {
			return {
				message: issue.message,
				key: issue.path?.[0].key as keyof ParsedFormValue | null,
			}
		})
		return { status: "error", errors }
	}
	let members = await prisma.member.findMany({
		select: { id: true },
		where: { workspaceId: session.workspace.id },
	})
	let data: Prisma.OperationUncheckedCreateInput = {
		...result.output,
		workspaceId: session.workspace.id,
		attachments: { create: result.output.attachments },
		debtors: { connect: members },
		creatorId: session.user.id,
	}
	await prisma.operation.create({ data })

	redirect("/expenses")
}

async function fileToAttachment(file: File) {
	return { data: await fileToBuffer(file), name: file.name }
}

async function fileToBuffer(file: File): Promise<Buffer> {
	return Buffer.from(await file.arrayBuffer())
}
