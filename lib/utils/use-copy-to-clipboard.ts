"use client";

import * as React from "react";
import { toast } from "sonner";

export interface useCopyToClipboardProps {
	timeout?: number;
}

export function useCopyToClipboard({
	timeout = 2000,
}: useCopyToClipboardProps) {
	const [isCopied, setIsCopied] = React.useState<boolean>(false);

	const copyToClipboard = (value: string, message?: string) => {
		if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
			return;
		}

		if (!value) {
			return;
		}

		navigator.clipboard.writeText(value).then(() => {
			setIsCopied(true);
			message && toast.success(message);

			setTimeout(() => {
				setIsCopied(false);
			}, timeout);
		});
	};

	return { isCopied, copyToClipboard };
}
