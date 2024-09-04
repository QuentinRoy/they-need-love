import { Kysely, sql } from "kysely"

export async function up(trx: Kysely<unknown>) {
	await trx.schema
		.createTable("member")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("name", "varchar")
		.execute()

	await trx.schema
		.createTable("operation")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("title", "varchar", (col) => col.notNull())
		.addColumn("amount", "integer", (col) => col.notNull())
		.addColumn("creditor", "integer", (col) =>
			col.references("member.id").notNull(),
		)
		.addColumn("date", "timestamp", (col) => col.notNull())
		.addColumn("description", "text")
		.addColumn("type", "varchar", (col) => col.notNull())
		.addCheckConstraint(
			"operation_type_check",
			sql`type IN ('expense', 'transaction')`,
		)
		.execute()

	await trx.schema
		.createTable("operation_attachment")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("operation", "integer", (col) =>
			col.references("operation.id").notNull(),
		)
		.addColumn("name", "varchar", (col) => col.notNull())
		.addColumn("data", "bytea", (col) => col.notNull())
		.execute()

	await trx.schema
		.createTable("salary")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("member", "integer", (col) =>
			col.references("member.id").notNull(),
		)
		.addColumn("amount", "integer", (col) => col.notNull())
		.addColumn("start", "timestamp", (col) => col.notNull())
		.addColumn("end", "timestamp", (col) => col.notNull())
		.execute()
}

export async function down(trx: Kysely<unknown>) {
	await trx.schema.dropTable("salary").execute()
	await trx.schema.dropTable("operation_attachment").execute()
	await trx.schema.dropTable("operation").execute()
	await trx.schema.dropTable("member").execute()
}
