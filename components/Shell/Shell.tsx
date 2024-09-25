"use client"

import { Anchor, AppShell, Group, Text } from "@mantine/core"
import { IconHeartFilled } from "@tabler/icons-react"
import * as classes from "./Shell.css"
import Link from "next/link"

export const metadata = {
	title: "Mantine Next.js template",
	description: "I am using Mantine with Next.js!",
}

export default function Shell({ children }: { children: any }) {
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
			<AppShell.Main bg="var(--mantine-color-gray-light)">
				{children}
			</AppShell.Main>
		</AppShell>
	)
}
