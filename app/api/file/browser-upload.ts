import type { NextApiResponse, NextApiRequest } from "next";
import { getServerSession } from "next-auth/next";

import { CustomUser } from "@/lib/types";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/auth";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const body = req.body as any;
	const handleUpload = (test: any) => {};
	try {
		const jsonResponse = await handleUpload({
			body,
			request: req,
			onBeforeGenerateToken: async (pathname: string) => {
				// Generate a client token for the browser to upload the file

				const session = await getServerSession(req, res, authOptions);
				if (!session) {
					res.status(401).end("Unauthorized");
					throw new Error("Unauthorized");
				}

				const userId = (session.user as CustomUser).id;
				const team = await prisma.team.findFirst({
					where: {
						users: {
							some: {
								userId,
							},
						},
					},
					select: {
						plan: true,
					},
				});

				let maxSize = 30 * 1024 * 1024; // 30 MB
				if (team?.plan === "pro") {
					maxSize = 100 * 1024 * 1024; // 100 MB
				}

				return {
					allowedContentTypes: ["application/pdf"],
					maximumSizeInBytes: maxSize, // 30 MB
					metadata: JSON.stringify({
						// optional, sent to your server on upload completion
						userId: (session.user as CustomUser).id,
					}),
				};
			},
			// onUploadCompleted: async ({ blob, tokenPayload }) => {
			// 	// Get notified of browser upload completion
			// 	// ⚠️ This will not work on `localhost` websites,
			// 	// Use ngrok or similar to get the full upload flow

			// 	try {
			// 		// Run any logic after the file upload completed
			// 		// const { userId } = JSON.parse(tokenPayload);
			// 		// await db.update({ avatar: blob.url, userId });
			// 	} catch (error) {
			// 		// throw new Error("Could not update user");
			// 	}
			// },
		});

		return res.status(200).json(jsonResponse);
	} catch (error) {
		// The webhook will retry 5 times waiting for a 200
		return res.status(400).json({ error: (error as Error).message });
	}
}
