import * as v from "valibot"

const envSchema = v.object({
	POSTGRES_URL: v.string(
		"POSTGRES_URL missing from the environment (URL to connect to the Postgres database)",
	),
	RESEND_API_KEY: v.string(
		"RESEND_API_KEY missing from the environment (api key from resend.com used for auth magic links).",
	),
	MAGIC_LINK_EMAIL_FROM: v.string(
		"MAGIC_LINK_EMAIL_FROM missing from the environment (email address to use with auth magic links).",
	),
})

const env = v.parse(envSchema, process.env)

export const postgresUrl = env.POSTGRES_URL
export const magicLinkEmailFrom = env.MAGIC_LINK_EMAIL_FROM
export const resendApiKey = env.RESEND_API_KEY
