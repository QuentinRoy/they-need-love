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
import type { Brand } from "valibot"

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

	async migrateToLatest() {
		let migrator = new Migrator({
			db: this.#db,
			provider: new FileMigrationProvider({ fs, path, migrationFolder }),
		})
		return migrator.migrateToLatest()
	}

	async rollback() {
		let migrator = new Migrator({
			db: this.#db,
			provider: new FileMigrationProvider({ fs, path, migrationFolder }),
		})
		return migrator.migrateDown()
	}

	async getOperations() {
		let operations = await this.#db
			.selectFrom("operation")
			.selectAll()
			.execute()
		return operations.map(({ id, creditor, ...rest }) => ({
			...rest,
			id: encodeOperationId(id),
			creditorId: encodeMemberId(creditor),
		}))
	}

	async addOperation({
		creditorId,
		...operation
	}: Omit<InsertObject<Database, "operation">, "creditor"> & {
		creditorId: MemberId
	}) {
		return this.#db.transaction().execute(async (trx) => {
			let { id: operationId } = await trx
				.insertInto("operation")
				.values({ ...operation, creditor: parseId(creditorId) })
				.returning("id")
				.executeTakeFirstOrThrow()
			await trx
				.insertInto("operation_debtor")
				.columns(["operation", "debtor"])
				.expression((eb) =>
					eb
						.selectFrom("member")
						.select([eb.val(operationId).as("operation"), "id"]),
				)
				.execute()
			return { id: encodeOperationId(operationId) }
		})
	}

	async getMembers() {
		let members = await this.#db.selectFrom("member").selectAll().execute()
		return members.map((member) => ({
			...member,
			id: encodeMemberId(member.id),
		}))
	}

	async addMember(member: InsertObject<Database, "member">) {
		await this.#db.insertInto("member").values(member).execute()
	}

	async addSalaryRecord({
		memberId,
		...salary
	}: Omit<InsertObject<Database, "salary">, "member"> & {
		memberId: MemberId
	}) {
		let result = await this.#db
			.insertInto("salary")
			.values({ ...salary, member: parseId(memberId) })
			.returning("id")
			.executeTakeFirstOrThrow()
		return { id: encodeSalaryId(result.id) }
	}

	async getSalaryRecords() {
		let records = await this.#db.selectFrom("salary").selectAll().execute()
		return records.map(({ id, member, ...rest }) => ({
			...rest,
			id: encodeSalaryId(id),
			memberId: encodeOperationId(member),
		}))
	}

	async destroy() {
		await this.#db.destroy()
	}
}

function parseId(id: string) {
	try {
		return parseInt(id)
	} catch (e) {
		throw new Error(`Invalid id: ${id}`)
	}
}
function encodeId<Tag extends string>(id: number) {
	return String(id) as string & Brand<Tag>
}
const encodeMemberId = encodeId<"MemberId">
const encodeOperationId = encodeId<"OperationId">
const encodeSalaryId = encodeId<"SalaryRecordId">

export const store = new Store(postgresUrl)
export type MemberId = ReturnType<typeof encodeMemberId>
export type OperationId = ReturnType<typeof encodeOperationId>
export type SalaryRecordId = ReturnType<typeof encodeSalaryId>
export type Operation = Awaited<ReturnType<typeof store.getOperations>>[number]
export type Member = Awaited<ReturnType<typeof store.getMembers>>[number]
export type SalaryRecord = Awaited<
	ReturnType<typeof store.getSalaryRecords>
>[number]
