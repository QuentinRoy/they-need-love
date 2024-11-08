"use client"

import { useMemo, useActionState } from "react"
import Form from "next/form"
import {
	Alert,
	Button,
	FileInput,
	Group,
	NumberInput,
	Radio,
	Textarea,
	TextInput,
} from "@mantine/core"
import { useFormStatus } from "react-dom"
import { IconExclamationCircle } from "@tabler/icons-react"
import { DateInput } from "@mantine/dates"
import { addExpense } from "./addExpense"
import type { AddExpenseState, ParsedFormValue } from "./addExpense"
import type { AssertEqual } from "@/lib/utils"

type InitialValues = Partial<
	Omit<ParsedFormValue, "attachments"> & {
		attachments?: File[]
	}
>

export namespace AddExpenseForm {
	export interface Props {
		creditors: Array<{ name: string; id: number }>
		initialValues?: InitialValues
	}
}

export function AddExpenseForm({
	creditors,
	initialValues,
}: AddExpenseForm.Props) {
	const { formAction, fieldErrors, otherErrors } = useExpenseForm()

	return (
		<Form action={formAction}>
			{otherErrors.map((error) => (
				<Alert
					mb="md"
					key={error.key}
					color="red"
					icon={<IconExclamationCircle />}
				>
					{error.message}
				</Alert>
			))}

			<TextInput
				name="name"
				required
				defaultValue={initialValues?.name}
				label="Title"
				error={fieldErrors.get("name")}
			/>
			<Radio.Group
				name="creditorId"
				required
				defaultValue={
					initialValues?.creditorId
						? initialValues.creditorId.toString()
						: undefined
				}
				label="Creditor"
				description="The person who paid for the expense"
				mt="md"
				error={fieldErrors.get("creditorId")}
			>
				<Group>
					{creditors.map((creditor, i) => (
						<Radio
							mt="xs"
							ml={i === 0 ? undefined : "sm"}
							key={creditor.id}
							value={creditor.id.toString()}
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
				<SubmitButton />
			</Group>
		</Form>
	)
}

function SubmitButton() {
	// This hook must be called from a component that is a descendant of a form
	// element.
	const { pending: isPending } = useFormStatus()
	return (
		<Button type="submit" loading={isPending}>
			Submit
		</Button>
	)
}

const fields = new Set([
	"name",
	"amount",
	"creditorId",
	"date",
	"description",
	"attachments",
] as const)
type FormValueKey = keyof ParsedFormValue
type Field = typeof fields extends Set<infer T>
	? AssertEqual<T, Exclude<FormValueKey, "type">>
	: never

function isField(key: unknown): key is Field {
	return (fields as Set<unknown>).has(key)
}

function useErrors(state: AddExpenseState) {
	let stateErrors = state.status === "error" ? state.errors : null
	return useMemo(() => {
		let fieldErrors = new Map<Field, string>()
		let otherErrors: Array<{ key: string | null; message: string }> = []
		for (let error of stateErrors ?? []) {
			if (isField(error.key)) {
				fieldErrors.set(error.key, error.message)
			} else {
				otherErrors.push(error)
			}
		}
		return { fieldErrors, otherErrors }
	}, [stateErrors])
}

function useExpenseForm() {
	const [state, formAction] = useActionState(addExpense, { status: "idle" })
	const { fieldErrors, otherErrors } = useErrors(state)
	return { formAction, fieldErrors, otherErrors }
}
