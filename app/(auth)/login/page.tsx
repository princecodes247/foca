"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import Google from "@/components/shared/icons/google";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { siteConfig } from "@/config/site";

export default function Login() {
	const { next } = useParams as { next?: string };

	const [isLoginWithEmail, setIsLoginWithEmail] = useState<boolean>(false);
	const [isLoginWithGoogle, setIsLoginWithGoogle] = useState<boolean>(false);
	const [email, setEmail] = useState<string>("");
	const [emailButtonText, setEmailButtonText] = useState<string>(
		"Continue with Email",
	);

	return (
		<div className="flex flex-wrap w-full h-screen ">
			{/* Left part */}
			<div className="flex justify-center w-full">
				<div
					className="absolute inset-x-0 flex justify-center overflow-hidden top-10 -z-10 transform-gpu blur-3xl"
					aria-hidden="true"
				></div>
				<div className="z-10 mt-[calc(20vh)] h-fit w-full mx-5 sm:mx-0 max-w-md overflow-hiddenbg-gray-50 rounded-lg">
					<div className="flex flex-col items-center justify-center px-4 py-6 pt-8 space-y-3 text-center sm:px-16">
						<Link href="/">
							<span className="text-2xl font-semibold text-balance">
								Welcome to {siteConfig.name}
							</span>
						</Link>
						<h3 className="text-sm text-balance ">{siteConfig.description}</h3>
					</div>
					<form
						className="flex flex-col gap-4 px-4 pt-8 sm:px-16"
						onSubmit={(e) => {
							e.preventDefault();
							setIsLoginWithEmail(true);
							signIn("email", {
								email: email,
								redirect: false,
								...(next && next.length > 0 ? { callbackUrl: next } : {}),
							}).then((res) => {
								if (res?.ok && !res?.error) {
									setEmail("");
									setEmailButtonText("Email sent - check your inbox!");
									toast.success("Email sent - check your inbox!");
								} else {
									setEmailButtonText("Error sending email - try again?");
									toast.error("Error sending email - try again?");
								}
								setIsLoginWithEmail(false);
							});
						}}
					>
						{/* <Input
              className= bg-white border-gray-200 border-1 hover:border-gray-200"
              placeholder="jsmith@company.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /> */}
						<label className="sr-only" htmlFor="email">
							Email
						</label>
						<Input
							id="email"
							placeholder="name@example.com"
							type="email"
							autoCapitalize="none"
							autoComplete="email"
							autoCorrect="off"
							disabled={isLoginWithEmail}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						{/* <Button type="submit" disabled={isLoginWithEmail}>
              {isLoginWithEmail && (
                <Loader className="w-5 h-5 mr-2 bg-gray-800 animate-spin hover:bg-gray-900" />
              )}
              Continue with Email
            </Button> */}
						<Button
							type="submit"
							isLoading={isLoginWithEmail}
							className={`${
								isLoginWithEmail ? "bg-black" : "bg-gray-800 hover:bg-gray-900 "
							} focus:outline-none focus:shadow-outline transform transition-colors duration-300 ease-in-out`}
						>
							{emailButtonText}
						</Button>
					</form>
					<p className="py-4 text-center">or</p>
					<div className="flex flex-col px-4 space-y-2 sm:px-16">
						<Button
							onClick={() => {
								setIsLoginWithGoogle(true);
								signIn("google", {
									...(next && next.length > 0
										? { callbackUrl: next }
										: {
												callbackUrl: "/app",
											}),
								}).then((res) => {
									if (res?.status) {
										setIsLoginWithGoogle(false);
									}
								});
							}}
							disabled={isLoginWithGoogle}
							variant="bordered"
						>
							{isLoginWithGoogle ? (
								<Loader className="w-5 h-5 mr-2 animate-spin" />
							) : (
								<Google className="w-5 h-5" />
							)}
							<span>Continue with Google</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
