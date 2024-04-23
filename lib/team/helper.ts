import prisma from "@/lib/prisma";

interface ITeamWithDomain {
	teamId: string;
	userId: string;
	domain?: string;
	options?: {};
}
