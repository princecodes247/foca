import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
	// `withAuth` augments your `Request` with the user's token.
	function middleware(req) {
		const url = req.nextUrl;

		// Get hostname of request (e.g. demo.drew-labs.com, demo.localhost:3000)
		let hostname = req.headers
			.get("host")!
			.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

		const searchParams = req.nextUrl.searchParams.toString();
		// Get the pathname of the request (e.g. /, /about, /blog/first-post)
		const path = `${url.pathname}${
			searchParams.length > 0 ? `?${searchParams}` : ""
		}`;

		// if (path.startsWith("/app")) {
		// 	console.log({ asdfgas: path });
		// 	return NextResponse.redirect(
		// 		`http://app.localhost:3000${path.replace("/app", "")}`,
		// 	);
		// }

		console.log({ tok: req.nextauth.token, path });
		// rewrites for app pages
		if (hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
			return NextResponse.rewrite(
				new URL(`/app${path === "/" ? "" : path}`, req.url),
			);
		}

		if (hostname === `album.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
			return NextResponse.rewrite(
				new URL(`/album${path === "/" ? "" : path}`, req.url),
			);
		}
	},
	{
		callbacks: {
			authorized: ({ req, token }) => {
				// console.log({ req, token });
				const url = req.nextUrl;
				const hostname = req.headers.get("host");

				const subdomain = hostname?.split(".")[0];

				// console.log({ hostname, subdomain, test: url.pathname });

				if (subdomain === "app" || url.pathname.includes("/app/")) {
					return !!token;
				}
				return true;
			},
		},
		pages: {
			signIn: "www.localhost:3000/login",
			error: "/error",
		},
	},
);

// export function middleware(request: NextRequest) {
// 	return NextResponse.redirect(new URL("/home", request.url));
// }

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - about
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
