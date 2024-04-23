import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log(req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        console.log({ req, token });
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
      error: "/error",
    },
  }
);

// export function middleware(request: NextRequest) {
//   return NextResponse.redirect(new URL("/home", request.url));
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
