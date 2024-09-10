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
import type { Tagged } from "type-fest"

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
		return operations.map(({ id, creditor, ...rest }) => ({
			...rest,
			id: id as OperationId,
			creditorId: creditor as MemberId,
		}))
	}

	async addOperation(
		operation: Omit<InsertObject<Database, "operation">, "creditor"> & {
			creditorId: MemberId
		},
	) {
		let result = await this.#db
			.insertInto("operation")
			.values({ ...operation, creditor: operation.creditorId })
			.returning("id")
			.executeTakeFirstOrThrow()
		return { id: result.id as OperationId }
	}

	async getMembers() {
		let members = await this.#db.selectFrom("member").selectAll().execute()
		return members.map((member) => ({
			...member,
			id: member.id as MemberId,
		}))
	}

	async addMember(member: InsertObject<Database, "member">) {
		await this.#db.insertInto("member").values(member).execute()
	}

	async addSalaryRecord(
		salary: Omit<InsertObject<Database, "salary">, "member"> & {
			memberId: MemberId
		},
	) {
		let result = await this.#db
			.insertInto("salary")
			.values({ ...salary, member: salary.memberId })
			.returning("id")
			.executeTakeFirstOrThrow()
		return { id: result.id as SalaryRecordId }
	}

	async getSalaryRecords() {
		let records = await this.#db.selectFrom("salary").selectAll().execute()
		return records.map(({ id, member, ...rest }) => ({
			...rest,
			id: id as SalaryRecordId,
			memberId: member as MemberId,
		}))
	}

	async destroy() {
		await this.#db.destroy()
	}
}

export const store = new Store(postgresUrl)

export type MemberId = Tagged<number, "MemberId">
export type OperationId = Tagged<number, "OperationId">
export type SalaryRecordId = Tagged<number, "SalaryRecordId">
export type Operation = Awaited<ReturnType<typeof store.getOperations>>[number]
export type Member = Awaited<ReturnType<typeof store.getMembers>>[number]
export type SalaryRecord = Awaited<
	ReturnType<typeof store.getSalaryRecords>
>[number]
