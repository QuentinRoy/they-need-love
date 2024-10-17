import { globalStyle, style } from "@vanilla-extract/css"
import { vars } from "@/theme"

export const container = style({})

globalStyle(`.mantine-AppShell-main:has(.${container})`, {
	backgroundColor: vars.colors.gray.light,
})
