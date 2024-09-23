import { OperationList } from "@components/OperationList/OperationList"
import { getExpenses, getMembers } from "@lib/store/cache"

export default async function ExpensesPage() {
	let expenses = await getExpenses()
	let memberList = await getMembers()
	let memberMap = new Map(memberList.map((m) => [m.id, m]))
	return <OperationList operations={expenses} members={memberMap} />
}
