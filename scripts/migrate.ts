import { Store } from "../lib/store/store"
import { postgresUrl } from "../lib/env"

let store = new Store(postgresUrl)
let { error, results } = await store.migrateToLatest()
await store.destroy()

if (error != null) {
	console.error(error)
	process.exit(1)
} else if (results != null && results.length > 0) {
	console.log(`Applied ${results.length} migrations:`)
	results.forEach((result) => {
		console.log(`- ${result.migrationName}`)
	})
} else {
	console.log("No migrations to apply")
}
