import { AppNavbar } from "@/components/app-navbar";

export default function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex flex-col min-h-screen">
			<AppNavbar />
			<div className="container flex-grow px-6 pt-16 mx-auto max-w-7xl">
				{children}
			</div>
		</div>
	);
}
