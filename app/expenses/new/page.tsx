import "@mantine/dates/styles.css"
import { AddExpenseForm } from "../../../components/AddExpenseForm/AddExpenseForm"
import { Container, Title } from "@mantine/core"
import { prisma } from "@lib/prisma"
import { auth } from "@lib/auth"

export const metadata = {
	title: "New expense | theyneedlove",
	description: "Register a new expense",
}

export default async function AddExpensePage() {
	let creditors = await prisma.member.findMany({
		select: { id: true, name: true },
		orderBy: { name: "desc" },
	})
	let session = await auth()
	let member = session?.member
	return (
		<Container my="sm" size="xs">
			<Title order={1}>New expense</Title>
			<AddExpenseForm
				creditors={creditors}
				initialValues={{ creditorId: member?.id }}
			/>
		</Container>
	)
}
