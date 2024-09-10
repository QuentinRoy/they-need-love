"use client"

import { Operation } from "@lib/store/store"

export function OperationList({ operations }: { operations: Operation[] }) {
	return (
		<div>
			{operations.map((op) => (
				<div key={op.id}>
					{op.amount} {op.description}
				</div>
			))}
		</div>
	)
}
