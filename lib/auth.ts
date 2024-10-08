import NextAuth, { type DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import type { Workspace, Member } from "@prisma/client"

declare module "next-auth" {
	/**
	 * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		member?: { id: Member["id"] } | null
		workspace?: { id: Workspace["id"] } | null
		user: {
			/** The user's postal address. */
			/**
			 * By default, TypeScript merges new interface properties and overwrites existing ones.
			 * In this case, the default session user properties will be overwritten,
			 * with the new ones defined above. To keep the default session user properties,
			 * you need to add them back into the newly declared interface.
			 */
		} & DefaultSession["user"]
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [],
	callbacks: {
		async session({ session, user }) {
			let dbUser = await prisma.user.findUnique({
				where: { id: user.id },
				select: {
					member: { select: { id: true } },
					workspace: { select: { id: true } },
				},
			})
			if (dbUser == null) {
				throw new Error(`User not found: ${user.id}`)
			}
			session.workspace = dbUser.workspace
			session.member = dbUser.member

			return session
		},
	},
})
