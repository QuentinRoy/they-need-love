import Link from "next/link"
import { Welcome } from "../components/Welcome/Welcome"
import { Anchor } from "@mantine/core"

export default function HomePage() {
	return (
		<>
			<Welcome />
			<Link href="/expenses/new" passHref legacyBehavior>
				<Anchor>Add operation</Anchor>
			</Link>
		</>
	)
}
