import { store } from "../lib/store/store"

let { error, results } = await store.rollback()
await store.destroy()

if (error != null) {
	console.error(error)
	process.exit(1)
} else if (results != null && results.length > 0) {
	console.log(`Rolled back ${results.length} migrations:`)
	results.forEach((result) => {
		console.log(`- ${result.migrationName}`)
	})
} else {
	console.log("No migrations to apply")
}
