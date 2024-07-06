"use client";
import { forwardRef, useEffect, useMemo, useState } from "react";
import {
	Cloud,
	CreditCard,
	EllipsisIcon,
	Github,
	Keyboard,
	LifeBuoy,
	LogOut,
	Mail,
	Menu,
	MessageSquare,
	PlusCircle,
	Settings,
	Trash2Icon,
	User,
	UserPlus,
	Users,
} from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
	DownloadCloudIcon,
	ExternalLink,
	EyeIcon,
	Plus,
	StarIcon,
	Trash,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Image } from "@prisma/client";

export interface ImageCardProps
	extends React.LabelHTMLAttributes<HTMLLabelElement> {
	deleteFn: () => void;
	markAsCoverImageFn: () => void;
	setImageHiddenStatusFn: () => void;
	image: Image;
}

const ImageCard = forwardRef<HTMLLabelElement, ImageCardProps>(
	(
		{ deleteFn, markAsCoverImageFn, setImageHiddenStatusFn, image, ...props },
		ref,
	) => {
		return (
			<label
				ref={ref}
				htmlFor="test"
				className="relative flex flex-col gap-1 group item"
			>
				<img
					src={image.url}
					alt="gallery album"
					className={cn(
						"object-cover w-full h-[200px] pointer-events-none select-none",
						image.isCoverImage && "border-2 border-blue-400",
					)}
				/>
				<div className="flex justify-between w-full gap-1 px-2 pb-1">
					<div className="flex gap-4 text-gray-400">
						<p className="flex items-center gap-1 text-sm">
							<EyeIcon size={14} />
							{image.views ?? 0}
						</p>
						<p className="flex items-center gap-1 text-sm">
							<DownloadCloudIcon size={14} />
							{image.downloads ?? 0}
						</p>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant={"ghost"}
								className="px-1 py-1 text-gray-400 h-fit"
							>
								<EllipsisIcon size={16} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56">
							<DropdownMenuGroup>
								<DropdownMenuItem onClick={markAsCoverImageFn}>
									<StarIcon className="w-4 h-4 mr-2" />
									<span>Make cover image</span>
									{/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
								</DropdownMenuItem>
								<DropdownMenuItem onClick={setImageHiddenStatusFn}>
									<EyeIcon className="w-4 h-4 mr-2" />
									<span>Hide Image</span>
									{/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
								</DropdownMenuItem>
								<DropdownMenuItem onClick={deleteFn}>
									<Trash2Icon className="w-4 h-4 mr-2 text-red-500" />
									<span>Delete Image</span>
									{/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</label>
		);
	},
);

ImageCard.displayName = "ImageCard";

export default ImageCard;
