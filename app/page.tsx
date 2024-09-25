import Link from "next/link"
import { Anchor, Stack } from "@mantine/core"

export default function HomePage() {
	return (
		<>
			<Stack>
				<Anchor href="/expenses/new" component={Link}>
					Add operation
				</Anchor>
				<Anchor href="/expenses" component={Link}>
					Operation list
				</Anchor>
			</Stack>
		</>
	)
}
