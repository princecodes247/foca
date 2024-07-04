import { Navbar } from "@/components/navbar";

export default function LandingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex flex-col min-h-screen">
			<Navbar />
			<div className="container flex-grow px-6 pt-16 mx-auto max-w-7xl">
				{children}
			</div>
		</div>
	);
}
