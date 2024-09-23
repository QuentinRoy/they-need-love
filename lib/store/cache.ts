import { revalidateTag, unstable_cache } from "next/cache"
import { store } from "./store"

const expensesTag = "expenses"
const membersTag = "members"

type Tag = typeof expensesTag | typeof membersTag

export const getExpenses = unstable_cache(
	() => store.getOperations(),
	["store"],
	{ revalidate: 3600, tags: [expensesTag] },
)

export const getMembers = unstable_cache(() => store.getMembers(), ["store"], {
	revalidate: 3600,
	tags: [membersTag],
})

export function revalidate(tag: Tag) {
	revalidateTag(tag)
}
