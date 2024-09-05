import "@mantine/dates/styles.css"
import { AddExpenseForm } from "../../../components/AddExpenseForm/AddExpenseForm"
import { Container, Title } from "@mantine/core"
import { store } from "../../../lib/store/store"

export const metadata = {
	title: "Register expense | theyneedlove",
	description: "Register a new expense",
}

export default async function AddExpensePage() {
	let creditors = await store.getMembers()
	return (
		<Container my="sm" size="xs">
			<Title order={1}>Register a new expense</Title>
			<AddExpenseForm creditors={creditors} />
		</Container>
	)
}