import Link from "next/link"
import { Anchor } from "@mantine/core"

export default function HomePage() {
	return (
		<>
			<Link href="/expenses/new" passHref legacyBehavior>
				<Anchor>Add operation</Anchor>
			</Link>
		</>
	)
}
