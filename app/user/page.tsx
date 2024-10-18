import { auth, signOut } from "@lib/auth"
import { Button, Container, Text } from "@mantine/core"

export default async function UserPage() {
	const session = await auth()
	const user = session?.user
	return (
		<Container size="xs">
			<Text mb="md">
				{user ? `Logged in as ${user.email}` : "Not logged in"}
			</Text>

			<form
				action={async () => {
					"use server"
					await signOut({ redirectTo: "/" })
				}}
			>
				<Button type="submit" disabled={user == null}>
					Sign out
				</Button>
			</form>
		</Container>
	)
}
