import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { CreateUserEmailProps, CustomUser } from "@/lib/types";
import { sendWelcomeEmail } from "@/lib/emails/send-welcome";
// import { identifyUser, trackAnalytics } from "@/lib/analytics";
import { sendVerificationRequestEmail } from "@/lib/emails/send-verification-request";
import { convertToSlug } from "@/lib/utils";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

// This function can run for a maximum of 180 seconds
export const config = {
	maxDuration: 10,
};

export const authOptions = {
	pages: {
		error: "/login",
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			allowDangerousEmailAccountLinking: true,
		}),

		EmailProvider({
			async sendVerificationRequest({ identifier, url }) {
				if (process.env.NODE_ENV === "development") {
					console.log("[Login URL]", url);
					return;
				}
				await sendVerificationRequestEmail({
					url,
					email: identifier,
				});
			},
		}),
	],
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },
	cookies: {
		sessionToken: {
			name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
			options: {
				httpOnly: true,
				sameSite: "lax",
				path: "/",
				// When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
				domain: VERCEL_DEPLOYMENT ? ".papermark.io" : undefined,
				secure: VERCEL_DEPLOYMENT,
			},
		},
	},
	callbacks: {
		jwt: async ({ token, user }) => {
			if (!token.email) {
				return {};
			}
			if (user) {
				token.user = user;
			}
			return token;
		},
		session: async ({ session, token }) => {
			(session.user as CustomUser) = {
				id: token.sub,
				// @ts-ignore
				...(token || session).user,
			};
			return session;
		},
	},
	events: {
		async createUser(message) {
			console.log({ message });
			const params: CreateUserEmailProps = {
				user: {
					name: message.user.name,
					email: message.user.email,
				},
			};

			// await identifyUser(message.user.email ?? message.user.id);
			// await trackAnalytics({
			// 	event: "User Signed Up",
			// 	email: message.user.email,
			// 	userId: message.user.id,
			// });

			await sendWelcomeEmail(params);
		},
		async signIn(message) {
			console.log({ message });
			const { user } = message as any as {
				user: CustomUser;
				isNewUser?: boolean | undefined;
			};
			const userTeams = await prisma.userTeam.findMany({
				where: {
					userId: user.id,
				},
			});
			if (userTeams.length === 0) {
				const teamName = `${user.name} Team`;
				const newTeam = await prisma.team.create({
					data: {
						name: teamName,
						slug: convertToSlug(teamName),
					},
				});
				const newUserTeam = await prisma.userTeam.create({
					data: {
						role: "ADMIN",
						teamId: newTeam.id,
						userId: user.id,
					},
				});
			}
			// await trackAnalytics({
			// 	event: "User Signed In",
			// 	email: message.user.email,
			// });
		},
	},
} satisfies NextAuthOptions;

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
