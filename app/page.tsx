"use client"

import Link from "next/link"
import { Button, Card, Container, Grid } from "@mantine/core"
import * as styles from "./page.css"

export default function HomePage() {
	return (
		<Container className={styles.container}>
			<Grid>
				<Grid.Col span={12}>
					<Card shadow="sm">You are owned...</Card>
				</Grid.Col>
				<Grid.Col span={6}>
					<Button href="/expenses" component={Link}>
						See expenses
					</Button>
				</Grid.Col>
				<Grid.Col span={6}>
					<Button href="/expenses/new" component={Link}>
						Add expense
					</Button>
				</Grid.Col>
			</Grid>
		</Container>
	)
}
