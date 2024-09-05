import { promises as fs } from "node:fs"
import * as path from "node:path"
import {
	FileMigrationProvider,
	Kysely,
	Migrator,
	PostgresDialect,
} from "kysely"
import pg from "pg"
import { Database } from "./schema"
import { InsertObject } from "kysely"
import { postgresUrl } from "../env"

const dirname = path.dirname(new URL(import.meta.url).pathname)
const migrationFolder = path.join(dirname, "migrations")

class Store {
	#db: Kysely<Database>

	constructor(postgresUrl: string) {
		this.#db = new Kysely({
			dialect: new PostgresDialect({
				pool: new pg.Pool({ connectionString: postgresUrl }),
			}),
		})
	}

	migrateToLatest() {
		let migrator = new Migrator({
			db: this.#db,
			provider: new FileMigrationProvider({ fs, path, migrationFolder }),
		})
		return migrator.migrateToLatest()
	}

	async getOperations() {
		let operations = await this.#db
			.selectFrom("operation")
			.selectAll()
			.execute()
		return operations.map((operation) => ({
			...operation,
			id: String(operation.id),
			creditor: String(operation.creditor),
		}))
	}

	async addOperation(
		operation: Omit<InsertObject<Database, "operation">, "creditor"> & {
			creditor: string
		},
	) {
		let result = await this.#db
			.insertInto("operation")
			.values({ ...operation, creditor: parseInt(operation.creditor, 10) })
			.returning("id")
			.executeTakeFirstOrThrow()
		return { id: String(result.id) }
	}

	async getMembers() {
		let members = await this.#db.selectFrom("member").selectAll().execute()
		return members.map((member) => ({ ...member, id: String(member.id) }))
	}

	async addMember(member: InsertObject<Database, "member">) {
		await this.#db.insertInto("member").values(member).execute()
	}

	addSalaryRecord(
		salary: Omit<InsertObject<Database, "salary">, "member"> & {
			member: string
		},
	) {
		return this.#db
			.insertInto("salary")
			.values({ ...salary, member: parseInt(salary.member, 10) })
			.execute()
	}

	async getSalaryRecords() {
		let records = await this.#db.selectFrom("salary").selectAll().execute()
		return records.map((record) => ({
			...record,
			id: String(record.id),
			member: String(record.member),
		}))
	}

	async destroy() {
		await this.#db.destroy()
	}
}

export const store = new Store(postgresUrl)
