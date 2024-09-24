import type { ColumnType, GeneratedAlways } from "kysely"

// Utility type to extract the type of a column from a table type.
type ForeignKey<
	Table,
	Prop extends keyof Table,
> = Table[Prop] extends ColumnType<infer T, unknown, unknown> ? T : Table[Prop]

interface MemberTable {
	id: GeneratedAlways<number>
	name: string
}

interface OperationTable {
	id: GeneratedAlways<number>
	title: string
	amount: number
	creditor: ForeignKey<MemberTable, "id">
	date: Date
	description?: string
	type: "expense" | "transaction"
}

interface OperationAttachmentTable {
	id: GeneratedAlways<number>
	operation: ForeignKey<OperationTable, "id">
	name: string
	data: Buffer
}

interface OperationDebtorTable {
	operation: ForeignKey<OperationTable, "id">
	debtor: ForeignKey<MemberTable, "id">
}

interface SalaryTable {
	id: GeneratedAlways<number>
	member: ForeignKey<MemberTable, "id">
	amount: number
	start: Date
	end: Date
}

export interface Database {
	member: MemberTable
	operation: OperationTable
	operation_attachment: OperationAttachmentTable
	operation_debtor: OperationDebtorTable
	salary: SalaryTable
}
