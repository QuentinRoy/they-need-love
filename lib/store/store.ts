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

const dirname = path.dirname(new URL(import.meta.url).pathname)
const migrationFolder = path.join(dirname, "migrations")

export class Store {
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

	getOperations() {
		return this.#db.selectFrom("operation").selectAll().execute()
	}

	addOperation(operation: InsertObject<Database, "operation">) {
		return this.#db.insertInto("operation").values(operation).execute()
	}

	getMembers() {
		return this.#db.selectFrom("member").selectAll().execute()
	}

	addMember(member: InsertObject<Database, "member">) {
		return this.#db.insertInto("member").values(member).execute()
	}

	async destroy() {
		await this.#db.destroy()
	}
}
