"use client";

import {
	changeImageOrderInGallery,
	deleteGallery,
	hideGallery,
	markImageAsCoverImage,
	removeImageFromGallery,
	setImageHiddenStatus,
	uploadImagesToGallery,
} from "@/actions/gallery.actions";
import UploadImagesModal from "@/components/modals/upload-images";
import { subtitle, title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import type { Gallery, Image } from "@prisma/client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";
import { ExternalLink, EyeIcon, Plus, Trash, X } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@nextui-org/switch";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { GalleryWithImages } from "@/types";
import ImageCard from "./_components/ImageCard";

export default function SingleGalleryPage({
	gallery,
}: {
	gallery: GalleryWithImages;
}) {
	// if (!gallery) return;
	const [files, setFiles] = useState<Blob[]>([]);
	const [isPublished, setIsPublished] = useState(gallery?.isPublished ?? false);
	const router = useRouter();
	const [images, setImages] = useState(
		gallery?.images.sort(
			(prevImage, currImage) => prevImage.order - currImage.order,
		) ?? [],
	);

	const onSortEnd = (oldIndex: number, newIndex: number) => {
		console.log({ oldIndex, newIndex });
		setImages((array) => arrayMoveImmutable(array, oldIndex, newIndex));
	};

	return (
		<div>
			<div className="flex flex-row items-center justify-between">
				<div>
					<h1
						className={title({
							size: "sm",
						})}
					>
						{gallery?.name}
					</h1>
					{/* <h1 className={title()}>{gallery?.name}</h1> */}
					<div>
						<Link
							href={`http://localhost:3000/album/${gallery?.slug}`}
							target="_blank"
							className="flex items-center gap-1 mt-2 text-sm text-gray-500 hover:underline group"
						>
							http://localhost:3000/album/{gallery?.slug}
							<ExternalLink
								size={15}
								className="duration-100 opacity-0 group-hover:opacity-100"
							/>
						</Link>
						<div className="flex items-center gap-2">
							<p className="text-sm text-gray-500 flex items-center mt-2">
								<EyeIcon className="w-4 h-4 mr-1" />
								{gallery?.views ?? 0} views
							</p>
							{/* <p>{gallery?.likes} likes</p> */}
						</div>
					</div>
					<div className="my-8">
						<UploadImagesModal
							files={files}
							setFiles={setFiles}
							submitFn={async () => {
								const formData = new FormData();

								for (const file of files) {
									formData.append("files[]", file);
								}

								formData.set("id", gallery?.id);

								await uploadImagesToGallery(formData);
								router.refresh();
							}}
						/>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2">
						<div className="relative">
							{isPublished && (
								<div className="absolute p-1 bg-green-300 rounded-full animate-ping" />
							)}
							<div
								className={cn(
									"p-1 rounded-full",
									isPublished ? "bg-green-400" : "bg-gray-300",
								)}
							/>
						</div>
						<p className="text-sm text-gray-600">
							{isPublished ? "Online" : "Offline"}
						</p>
					</div>
					<Switch
						isSelected={isPublished}
						onChange={() => {
							hideGallery(gallery.id, !isPublished);
							setIsPublished(!isPublished);
						}}
					/>
					<Button
						variant="light"
						className="absolute px-2 min-w-fit min-h-fit top-2 right-2"
						onClick={async () => {
							await deleteGallery(gallery.id);
							toast("Image deleted!");
						}}
					>
						<Trash size={15} />
					</Button>
				</div>
			</div>
			<div className="w-full p-4 text-left">
				<SortableList
					onSortEnd={onSortEnd}
					className="grid gap-4 sm:grid-cols-2 md:grid-cols-4"
					draggedItemClassName="shadow shadow-red-400"
					dropTarget={
						<div className="relative item h-[200px] flex justify-center items-center text-xl bg-green-400/40 border-4 border-green-400 border-dashed -z-10 opacity-60">
							Drop
						</div>
					}
				>
					{images.map((image) => (
						<SortableItem key={image.id}>
							<ImageCard
								htmlFor="test"
								deleteFn={async () => {
									const originalImages = [...images];
									setImages((prev) => prev.filter((item) => item !== image));
									try {
										await removeImageFromGallery(image.id);
									} catch (error) {
										setImages(originalImages);
									}
									toast("Image deleted!");
								}}
								markAsCoverImageFn={() => {
									markImageAsCoverImage(image.id, !image.isCoverImage);
									router.refresh();
								}}
								setImageHiddenStatusFn={() => {
									setImageHiddenStatus(image.id, !image.isHidden);
									router.refresh();
								}}
								image={image}
							/>
						</SortableItem>
					))}
				</SortableList>
				<div className="pt-6">
					<Button
						onClick={() => {
							console.log({
								imageSort: images.map((image, index) => ({
									id: image.id,
									order: index + 1,
								})),
							});
							changeImageOrderInGallery(
								gallery.id,
								images.map((image, index) => ({
									id: image.id,
									order: index + 1,
								})),
							);
						}}
					>
						Save Changes
					</Button>
				</div>

				{gallery?.images && gallery?.images?.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-4">
						<p className="text-sm text-center text-gray-400">
							No images yet...
						</p>
						{/* <Button variant="flat" startContent={<Plus />}  isLoading>
							Upload some ⚡️
						</Button> */}
					</div>
				) : (
					""
				)}
			</div>
		</div>
	);
}
