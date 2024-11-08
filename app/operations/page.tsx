import { OperationList } from "@components/OperationList/OperationList"
import { prisma } from "@lib/prisma"

export default async function OperationsPage() {
	let expenses = await prisma.operation.findMany({
		where: { type: "expense" },
	})
	let memberList = await prisma.member.findMany({
		select: { id: true, name: true },
	})
	let memberMap = new Map(memberList.map((m) => [m.id, m]))
	return <OperationList operations={expenses} members={memberMap} />
}
