import type { NextRequest } from "next/server"
import type { Member } from "@prisma/client"

type MemberId = Member["id"]

export async function getUser(
	_req?: NextRequest,
): Promise<{ id: MemberId } | null> {
	console.warn("getUser is not implemented")
	return { id: 1 as MemberId }
}

export async function authenticate(_req?: NextRequest) {
	console.warn("authenticate is not implemented")
	return true
}
