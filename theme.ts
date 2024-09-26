"use client"

import { createTheme } from "@mantine/core"
import { themeToVars } from "@mantine/vanilla-extract"

export const theme = createTheme({
	cursorType: "pointer",
	respectReducedMotion: true,
	defaultRadius: "md",
})
export const vars = themeToVars(theme)
