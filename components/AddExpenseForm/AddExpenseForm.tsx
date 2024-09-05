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
import { submit } from "./submit"
import { useRouter } from "next/navigation"

interface AddExpenseFormValues {
	title: string
	amount: string
	creditor: string
	date: Date
	description: string
	attachments: File[]
}

export namespace AddExpenseForm {
	export interface Props {
		creditors: Array<{ name: string; id: string }>
		initialValues?: Partial<AddExpenseFormValues>
	}
}

export function AddExpenseForm({
	creditors,
	initialValues,
}: AddExpenseForm.Props) {
	const router = useRouter()
	return (
		<form
			action={(...args) =>
				submit(...args).then((result) => {
					if (result.success && result.operationId != null) {
						router.push("/")
					} else {
						throw new Error("Failed to submit form")
					}
				})
			}
		>
			<TextInput
				name="title"
				required
				defaultValue={initialValues?.title}
				label="Title"
				mt="md"
			/>
			<Radio.Group
				name="creditor"
				required
				defaultValue={initialValues?.creditor}
				label="Creditor"
				description="The person who paid for the expense"
				mt="md"
			>
				<Group>
					{creditors.map((creditor, i) => (
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
			/>
			<DateInput
				name="date"
				required
				defaultValue={initialValues?.date ?? new Date()}
				mt="md"
				label="Date"
			/>
			<Textarea
				name="description"
				defaultValue={initialValues?.description}
				mt="md"
				label="Notes or description"
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
			/>
			<Group justify="flex-end" mt="md">
				<Button type="submit">Submit</Button>
			</Group>
		</form>
	)
}
