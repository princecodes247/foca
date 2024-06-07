import { Card, CardBody } from "@nextui-org/card";
import { Gallery } from "@prisma/client";
import Link from "next/link";
import React from "react";

export default function GalleryCard({ name, images, slug }: Partial<Gallery>) {
	return (
		<Link href={`./${slug}`}>
			<Card isPressable>
				<CardBody>
					<h3 className="text-2xl">
						{name && name?.trim()?.length > 0 ? name : "No Name"}
					</h3>
					<p className="text-sm text-gray-400">Images: {images?.length ?? 0}</p>
				</CardBody>
			</Card>
		</Link>
	);
}
