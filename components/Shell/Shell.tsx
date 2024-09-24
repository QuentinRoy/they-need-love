"use client"

import { AppShell, Flex, Title } from "@mantine/core"
import { IconHeartFilled } from "@tabler/icons-react"
import * as classes from "./Shell.css"

export const metadata = {
	title: "Mantine Next.js template",
	description: "I am using Mantine with Next.js!",
}

export default function Shell({ children }: { children: any }) {
	return (
		<AppShell>
			<AppShell.Header px="md">
				<Title order={1}>
					<Flex align="center">
						<div>They Need</div>
						<IconHeartFilled className={classes.icon} />
					</Flex>
				</Title>
			</AppShell.Header>
			<AppShell.Main>{children}</AppShell.Main>
		</AppShell>
	)
}
