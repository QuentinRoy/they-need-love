import Link from "next/link"
import { Welcome } from "../components/Welcome/Welcome"
import { ColorSchemeToggle } from "../components/ColorSchemeToggle/ColorSchemeToggle"
import { Anchor } from "@mantine/core"

export default function HomePage() {
	return (
		<>
			<Welcome />
			<ColorSchemeToggle />
			<Link href="/expenses/new" passHref legacyBehavior>
				<Anchor>Add operation</Anchor>
			</Link>
		</>
	)
}
