import { redirect } from "next/navigation";
import { title } from "@/components/primitives";
import prisma from "@/lib/prisma";

export default async function AppPage() {
	const userTeams =
		(await prisma?.userTeam.findMany({
			take: 1,
			include: {
				team: true,
			},
		})) ?? [];
	console.log({ userTeams: userTeams[0].team });
	redirect(
		userTeams.length > 0 ? `/app/${userTeams[0].team?.slug}` : "team/new",
	);
	return (
		<div>
			<h1 className={title()}>
				{userTeams.length > 0 ? <>{userTeams[0].team?.slug}</> : null}
			</h1>
		</div>
	);
}
