import { signIn } from "@lib/auth"
import { Button, Container, Group, TextInput, Title } from "@mantine/core"

async function action(formData: FormData) {
	"use server"
	let email = formData.get("email")
	let invitation = formData.get("invitation")
	if (invitation == null) {
		// TODO: check if the email exists, and if it does not, refuse to sign in.
		await signIn("resend", { email, redirectTo: "/" })
	} else {
		await signIn("email", { email, redirectTo: "/" })
		// TODO: setup invitation things.
	}
}

export default function SignInPage() {
	return (
		<Container size="xs">
			<Title order={1}>Sign in</Title>
			<form action={action}>
				<TextInput
					type="email"
					name="email"
					placeholder="john@doe.com"
					label="Email"
					mt="md"
				/>
				<Group justify="flex-end" mt="md">
					<Button type="submit">Signin</Button>
				</Group>
			</form>
		</Container>
	)
}
