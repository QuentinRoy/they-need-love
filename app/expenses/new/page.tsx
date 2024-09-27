import "@mantine/dates/styles.css"
import { AddExpenseForm } from "../../../components/AddExpenseForm/AddExpenseForm"
import { Container, Title } from "@mantine/core"
import { getMembers } from "@lib/store/cache"
import { getUser } from "@lib/auth"

export const metadata = {
	title: "New expense | theyneedlove",
	description: "Register a new expense",
}

export default async function AddExpensePage() {
	let creditors = await getMembers()
	let user = await getUser()
	return (
		<Container my="sm" size="xs">
			<Title order={1}>New expense</Title>
			<AddExpenseForm
				creditors={creditors}
				initialValues={{ creditor: user?.id }}
			/>
		</Container>
	)
}
