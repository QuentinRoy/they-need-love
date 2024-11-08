"use client"

import { Anchor, AppShell, Group } from "@mantine/core"
import { IconHeartFilled } from "@tabler/icons-react"
import * as classes from "./Shell.css"
import Link from "next/link"

export const metadata = {
	title: "They Need Love",
	description:
		"A small application for separated parents to manage shared expenses about their children",
}

export default function Shell({ children }: { children: React.ReactNode }) {
	return (
		<AppShell header={{ height: "60" }} padding="md">
			<AppShell.Header>
				<Anchor
					c="inherit"
					href="/"
					variant="text"
					size="lg"
					fw={700}
					underline="never"
					component={Link}
				>
					<Group h="100%" px="md" gap="0">
						They Need&nbsp;
						<IconHeartFilled className={classes.icon} />
					</Group>
				</Anchor>
			</AppShell.Header>
			<AppShell.Main>{children}</AppShell.Main>
		</AppShell>
	)
}
