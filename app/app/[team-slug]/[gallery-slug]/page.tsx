import UploadImagesModal from "@/components/modals/upload-images";
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import Image from "next/image";

export default async function GalleryPage({
	params,
}: { params: { "team-slug": string; "gallery-slug": string } }) {
	console.log({ params });
	const gallery = await prisma?.gallery.findFirst({
		where: {
			slug: params["gallery-slug"],
		},
	});
	return (
		<div>
			<h1 className={title()}>{gallery?.name}</h1>
			{/* <h1 className={title()}>{gallery?.name}</h1> */}
			<div className="my-8">
				<UploadImagesModal />
			</div>{" "}
			<div className="w-full p-4 text-left">
				<h3>Images</h3>
				<div className="grid grid-cols-4 gap-6">
					{gallery?.images && gallery?.images?.length > 0
						? gallery?.images?.map((image, index) => (
								<div key={index}>
									<img
										src={image}
										alt="gallery album"
										width={100}
										height={100}
									/>
								</div>
							))
						: ""}
				</div>

				{gallery?.images && gallery?.images?.length === 0 ? (
					<div className="text-sm text-center text-gray-400">
						No images yet...
					</div>
				) : (
					""
				)}
			</div>
		</div>
	);
}
