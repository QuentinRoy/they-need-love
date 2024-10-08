import type { NextRequest } from "next/server"
import type { Member, Workspace } from "@prisma/client"

export async function getUser(
	_req?: NextRequest,
): Promise<{ id: Member["id"]; workspaceId: Workspace["id"] } | null> {
	console.warn("getUser is not implemented")
	return { id: 1, workspaceId: 1 }
}

export async function authenticate(_req?: NextRequest) {
	console.warn("authenticate is not implemented")
	return true
}
