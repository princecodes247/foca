import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import GalleryCard from "./_components/gallery-card";
import CreateGalleryModal from "@/components/modals/create-gallery";
import prisma from "@/lib/prisma";

export default async function OverviewPage({
	params,
}: {
	params: { "team-slug": string };
}) {
	const galleries = (await prisma?.gallery.findMany()) ?? [];
	console.log({ galleries, params });
	return (
		<div>
			<h1 className={title()}>Overview</h1>
			<div className="py-6">
				<CreateGalleryModal />
			</div>
			<div className="grid grid-cols-3 gap-4 py-8">
				{galleries?.map((gallery, index) => (
					<GalleryCard
						key={index}
						name={gallery.name}
						slug={`${params["team-slug"]}/${gallery.slug}`}
						images={gallery.images}
					/>
				))}
			</div>
			{galleries?.length === 0 && <p>No Gallery found</p>}
		</div>
	);
}
