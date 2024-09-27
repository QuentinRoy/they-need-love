import "@mantine/core/styles.css"
import { MantineProvider, ColorSchemeScript } from "@mantine/core"
import { theme } from "../theme"
import Shell from "@components/Shell/Shell"

export const metadata = {
	title: "They Need Love",
	description:
		"A simple app to manage shared expenses for separated couples with children",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<head>
				<ColorSchemeScript />
				<link rel="shortcut icon" href="/favicon.svg" />
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
				/>
			</head>
			<body>
				<MantineProvider theme={theme}>
					<Shell>{children}</Shell>
				</MantineProvider>
			</body>
		</html>
	)
}
