"use client"

import { MemberId, Operation } from "@lib/store/store"
import { Table } from "@mantine/core"

export function OperationList({
	operations,
	members,
}: {
	operations: Operation[]
	members: Map<MemberId, { name: string }>
}) {
	function getMemberName(memberId: MemberId) {
		let member = members.get(memberId)
		if (member == null) {
			throw new Error(`Member not found: ${memberId}`)
		}
		return member.name
	}

	const rows = operations.map((op) => (
		<Table.Tr key={op.id}>
			<Table.Td>{op.title}</Table.Td>
			<Table.Td>{op.amount}€</Table.Td>
			<Table.Td>{getMemberName(op.creditorId)}</Table.Td>
			<Table.Td>{op.description}</Table.Td>
		</Table.Tr>
	))

	return (
		<Table>
			<Table.Thead>
				<Table.Tr>
					<Table.Th>Title</Table.Th>
					<Table.Th>Amount</Table.Th>
					<Table.Th>Creditor</Table.Th>
					<Table.Th>Description</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>{rows}</Table.Tbody>
		</Table>
	)
}
