import * as v from "valibot"

const envSchema = v.object({
	POSTGRES_URL: v.string(
		"URL to connect to the Postgres database is missing from the environment.",
	),
})

const env = v.parse(envSchema, process.env)

export const postgresUrl = env.POSTGRES_URL
