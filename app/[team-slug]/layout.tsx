import { SessionProvider } from "next-auth/react";
import { authOptions } from "../auth";
import { getServerSession } from "next-auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  console.log({ session: session?.user?.email });
  return (
    <>
      {/* <p>{session.user}</p> */}
      <p>{session?.user?.name}</p>
      {children}
    </>
  );
}
