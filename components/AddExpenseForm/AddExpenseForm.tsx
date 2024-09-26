"use client"

import {
	Button,
	FileInput,
	Group,
	NumberInput,
	Radio,
	Textarea,
	TextInput,
} from "@mantine/core"
import { DateInput } from "@mantine/dates"
import { addExpense } from "./addExpense"
import type { MemberId } from "@lib/store/store"
import { useFormState, useFormStatus } from "react-dom"
import { useMemo } from "react"

interface AddExpenseFormValues {
	title: string
	amount: string
	creditor: MemberId
	date: Date
	description: string
	attachments: File[]
}

export namespace AddExpenseForm {
	export interface Props {
		creditors: Array<{ name: string; id: MemberId }>
		initialValues?: Partial<AddExpenseFormValues>
	}
}

export function AddExpenseForm({
	creditors,
	initialValues,
}: AddExpenseForm.Props) {
	const [state, formAction] = useFormState(addExpense, { status: "idle" })
	const { pending } = useFormStatus()

	let fieldErrors = new Map(
		state.status === "error" ? state.errors.map((e) => [e.key, e.message]) : [],
	)
	let sortedCreditors = useMemo(
		() => creditors.toSorted((c1, c2) => c1.name.localeCompare(c2.name)),
		[creditors],
	)

	return (
		<form action={formAction}>
			<TextInput
				name="title"
				required
				defaultValue={initialValues?.title}
				label="Title"
				mt="md"
				error={fieldErrors.get("title")}
			/>
			<Radio.Group
				name="creditorId"
				required
				defaultValue={initialValues?.creditor}
				label="Creditor"
				description="The person who paid for the expense"
				mt="md"
				error={fieldErrors.get("creditorId")}
			>
				<Group>
					{sortedCreditors.map((creditor, i) => (
						<Radio
							mt="xs"
							ml={i === 0 ? undefined : "sm"}
							key={creditor.id}
							value={creditor.id}
							label={creditor.name}
						/>
					))}
				</Group>
			</Radio.Group>
			<NumberInput
				name="amount"
				required
				defaultValue={initialValues?.amount}
				label="Amount"
				description="Amount of money spent in euros"
				leftSection="€"
				mt="md"
				error={fieldErrors.get("amount")}
			/>
			<DateInput
				name="date"
				required
				defaultValue={initialValues?.date ?? new Date()}
				mt="md"
				label="Date"
				error={fieldErrors.get("date")}
			/>
			<Textarea
				name="description"
				defaultValue={initialValues?.description}
				mt="md"
				label="Notes or description"
				error={fieldErrors.get("description")}
			/>
			<FileInput
				name="attachments"
				defaultValue={initialValues?.attachments}
				mt="md"
				label="Attachment(s)"
				capture
				multiple
				clearable
				placeholder="Select file(s)"
				description="Optional attachments related to the expense, like receipts"
				error={fieldErrors.get("attachments")}
			/>
			<Group justify="flex-end" mt="md">
				<Button type="submit" loading={pending}>
					Submit
				</Button>
			</Group>
		</form>
	)
}
