import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ms from "ms";
import bcrypt from "bcryptjs";
import { toast } from "sonner";
import { customAlphabet } from "nanoid";
import crypto from "crypto";
import { siteConfig } from "@/config/site";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function classNames(...classes: string[]) {
	const uniqueClasses = Array.from(new Set(classes.join(" ").split(" ")));
	return uniqueClasses.join(" ");
}

export function getExtension(url: string) {
	// @ts-ignore
	return url.split(/[#?]/)[0].split(".").pop().trim();
}

interface SWRError extends Error {
	status: number;
}

export async function fetcher<JSON = any>(
	input: RequestInfo,
	init?: RequestInit,
): Promise<JSON> {
	const res = await fetch(input, init);

	if (!res.ok) {
		const error = await res.text();
		const err = new Error(error) as SWRError;
		err.status = res.status;
		throw err;
	}

	return res.json();
}

export const log = async ({
	message,
	type,
	mention = false,
}: {
	message: string;
	type: "info" | "cron" | "links" | "error";
	mention?: boolean;
}) => {
	/* If in development or env variable not set, log to the console */
	if (
		process.env.NODE_ENV === "development" ||
		!process.env.PPMK_SLACK_WEBHOOK_URL
	) {
		console.log(message);
		return;
	}

	/* Log a message to channel */
	try {
		return await fetch(`${process.env.PPMK_SLACK_WEBHOOK_URL}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				blocks: [
					{
						type: "section",
						text: {
							type: "mrkdwn",
							// prettier-ignore
							text: `${mention ? "<@U05BTDUKPLZ> " : ""}${
								type === "error" ? ":rotating_light: " : ""
							}${message}`,
						},
					},
				],
			}),
		});
	} catch (e) {}
};

export function bytesToSize(bytes: number) {
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	if (bytes === 0) return "n/a";
	const i = Math.floor(Math.log(bytes) / Math.log(1000));
	if (i === 0) return `${bytes} ${sizes[i]}`;
	const sizeInCurrentUnit = bytes / 1000 ** i;
	if (sizeInCurrentUnit >= 1000 && i < sizes.length - 1) {
		return `1 ${sizes[i + 1]}`;
	}
	return `${Math.round(sizeInCurrentUnit)} ${sizes[i]}`;
}

const isValidUrl = (url: string) => {
	try {
		new URL(url);
		return true;
	} catch (e) {
		return false;
	}
};

export const getDomainWithoutWWW = (url: string) => {
	if (isValidUrl(url)) {
		return new URL(url).hostname.replace(/^www\./, "");
	}
	try {
		if (url.includes(".") && !url.includes(" ")) {
			return new URL(`https://${url}`).hostname.replace(/^www\./, "");
		}
	} catch (e) {
		return "(direct)"; // Not a valid URL, but cannot return null
	}
};

export function capitalize(str: string) {
	if (!str || typeof str !== "string") return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export const timeAgo = (timestamp?: Date): string => {
	if (!timestamp) return "Just now";
	const diff = Date.now() - new Date(timestamp).getTime();
	if (diff < 60000) {
		// less than 1 second
		return "Just now";
	} else if (diff > 82800000) {
		// more than 23 hours – similar to how Twitter displays timestamps
		return new Date(timestamp).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year:
				new Date(timestamp).getFullYear() !== new Date().getFullYear()
					? "numeric"
					: undefined,
		});
	}
	return `${ms(diff)} ago`;
};

export const durationFormat = (durationInMilliseconds?: number): string => {
	if (!durationInMilliseconds) return "0 secs";

	if (durationInMilliseconds < 60000) {
		return `${Math.round(durationInMilliseconds / 1000)} secs`;
	} else {
		const minutes = Math.floor(durationInMilliseconds / 60000);
		const seconds = Math.round((durationInMilliseconds % 60000) / 1000);
		return `${minutes}:${seconds.toString().padStart(2, "0")} mins`;
	}
};

export function nFormatter(num?: number, digits?: number) {
	if (!num) return "0";
	const lookup = [
		{ value: 1, symbol: "" },
		{ value: 1e3, symbol: "K" },
		{ value: 1e6, symbol: "M" },
		{ value: 1e9, symbol: "G" },
		{ value: 1e12, symbol: "T" },
		{ value: 1e15, symbol: "P" },
		{ value: 1e18, symbol: "E" },
	];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	var item = lookup
		.slice()
		.reverse()
		.find(function (item) {
			return num >= item.value;
		});
	return item
		? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
		: "0";
}

export const getDateTimeLocal = (timestamp?: Date): string => {
	const d = timestamp ? new Date(timestamp) : new Date();
	if (d.toString() === "Invalid Date") return "";
	return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
		.toISOString()
		.split(":")
		.slice(0, 2)
		.join(":");
};

export async function hashPassword(password: string): Promise<string> {
	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	return hashedPassword;
}

export async function checkPassword(
	password: string,
	hashedPassword: string,
): Promise<boolean> {
	const match = await bcrypt.compare(password, hashedPassword);
	return match;
}

export function copyToClipboard(text: string, message: string): void {
	navigator.clipboard
		.writeText(text)
		.then(() => {
			toast.success(message);
		})
		.catch((error) => {
			toast.warning("Please copy your link manually.");
		});
}

export const getFirstAndLastDay = (day: number) => {
	const today = new Date();
	const currentDay = today.getDate();
	const currentMonth = today.getMonth();
	const currentYear = today.getFullYear();
	if (currentDay >= day) {
		// if the current day is greater than target day, it means that we just passed it
		return {
			firstDay: new Date(currentYear, currentMonth, day),
			lastDay: new Date(currentYear, currentMonth + 1, day - 1),
		};
	} else {
		// if the current day is less than target day, it means that we haven't passed it yet
		const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear; // if the current month is January, we need to go back a year
		const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // if the current month is January, we need to go back to December
		return {
			firstDay: new Date(lastYear, lastMonth, day),
			lastDay: new Date(currentYear, currentMonth, day - 1),
		};
	}
};

export const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	});
};

export const nanoid = customAlphabet(
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
	7,
); // 7-character random string

export const daysLeft = (
	accountCreationDate: Date,
	maxDays: number,
): number => {
	const now = new Date();
	const endPeriodDate = new Date(accountCreationDate);
	endPeriodDate.setDate(accountCreationDate.getDate() + maxDays);

	const diffInMilliseconds = endPeriodDate.getTime() - now.getTime();

	// Convert milliseconds to days and return
	return Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
};

const cutoffDate = new Date("2023-10-17T00:00:00.000Z");

export const calculateDaysLeft = (accountCreationDate: Date): number => {
	let maxDays;
	if (accountCreationDate < cutoffDate) {
		maxDays = 30;
		accountCreationDate = new Date("2023-10-01T00:00:00.000Z");
	} else {
		maxDays = 14;
	}
	return daysLeft(accountCreationDate, maxDays);
};

export function constructMetadata({
	title = siteConfig.name,
	description = siteConfig.description,
	image = "https://www.papermark.io/_static/meta-image.png",
	favicon = "/favicon.ico",
	noIndex = false,
}: {
	title?: string;
	description?: string;
	image?: string;
	favicon?: string;
	noIndex?: boolean;
} = {}) {
	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: [
				{
					url: image,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [image],
			creator: "@papermarkio",
		},
		favicon,
		...(noIndex && {
			robots: {
				index: false,
				follow: false,
			},
		}),
	};
}

export const convertDataUrlToFile = ({
	dataUrl,
	filename = "logo.png",
}: {
	dataUrl: string;
	filename?: string;
}) => {
	const arr = dataUrl.split(",");
	const match = arr[0].match(/:(.*?);/);
	const mime = match ? match[1] : "";
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	filename =
		mime == "image/png"
			? "logo.png"
			: mime == "image/jpeg"
				? "logo.jpg"
				: filename;

	return new File([u8arr], filename, { type: mime });
};

// export const uploadImage = async (file: File) => {
//   const newBlob = await upload(file.name, file, {
//     access: "public",
//     handleUploadUrl: "/api/file/logo-upload",
//   });

//   return newBlob.url;
// };

/**
 * Generates a Gravatar hash for the given email.
 * @param {string} email - The email address.
 * @returns {string} The Gravatar hash.
 */
export const generateGravatarHash = (email: string | null): string => {
	if (!email) return "";
	// 1. Trim leading and trailing whitespace from an email address
	const trimmedEmail = email.trim();

	// 2. Force all characters to lower-case
	const lowerCaseEmail = trimmedEmail.toLowerCase();

	// 3. Hash the final string with SHA256
	const hash = crypto.createHash("sha256").update(lowerCaseEmail).digest("hex");

	return hash;
};

export const sanitizeAllowDenyList = (list: string): string[] => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const domainRegex = /^@[^\s@]+\.[^\s@]+$/;

	return list
		.split("\n")
		.map((item) => item.trim().replace(/,$/, "")) // Trim whitespace and remove trailing commas
		.filter((item) => item !== "") // Remove empty items
		.filter((item) => emailRegex.test(item) || domainRegex.test(item)); // Remove items that don't match email or domain regex
};

export function convertToSlug(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "") // Remove special characters except hyphen and whitespace
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/--+/g, "-") // Replace consecutive hyphens with a single hyphen
		.trim(); // Trim leading and trailing spaces
}
