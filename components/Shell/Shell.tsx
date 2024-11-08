"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Anchor, AppShell, Group, NavLink, Burger } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import {
	IconHeartFilled,
	IconScale,
	IconBabyBottle,
	IconMoneybag,
	IconLayoutList,
} from "@tabler/icons-react"
import * as classes from "./Shell.css"

export const metadata = {
	title: "They Need Love",
	description:
		"A small application for separated parents to manage shared expenses about their children",
}

const links = [
	{
		href: "/",
		label: "Dashboard",
		icon: <IconScale size="1rem" stroke={1.5} />,
	},
	{
		href: "/operations",
		label: "Operations",
		icon: <IconLayoutList size="1rem" stroke={1.5} />,
	},
	{
		href: "/baby-sitting",
		label: "Baby Sitting",
		icon: <IconBabyBottle size="1rem" stroke={1.5} />,
	},
	{
		href: "/salaries",
		label: "Salaries",
		icon: <IconMoneybag size="1rem" stroke={1.5} />,
	},
]

export default function Shell({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const [opened, { toggle }] = useDisclosure()
	return (
		<AppShell
			header={{ height: "60" }}
			navbar={{
				width: 200,
				breakpoint: "sm",
				collapsed: { mobile: !opened },
			}}
			padding="md"
		>
			<AppShell.Header>
				<Group h="100%" px="md">
					<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
					<Anchor
						c="inherit"
						href="/"
						variant="text"
						size="lg"
						fw={700}
						underline="never"
						component={Link}
					>
						<Group h="100%" gap={0}>
							They Need&nbsp;
							<IconHeartFilled className={classes.icon} />
						</Group>
					</Anchor>
				</Group>
			</AppShell.Header>
			<AppShell.Main>{children}</AppShell.Main>
			<AppShell.Navbar>
				{links.map(({ href, label, icon }) => (
					<NavLink
						key={href}
						px="md"
						active={pathname === href}
						href={href}
						label={label}
						leftSection={icon}
					/>
				))}
			</AppShell.Navbar>
		</AppShell>
	)
}
