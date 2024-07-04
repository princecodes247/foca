import SingleGalleryPage from "./SingleGalleryPage";

export default async function GalleryPage({
	params,
}: { params: { "team-slug": string; "gallery-slug": string } }) {
	const gallery = await prisma?.gallery.findFirst({
		where: {
			slug: params["gallery-slug"],
		},
		include: {
			images: true,
		},
	});
	if (!gallery) return;
	console.log({ params, gallery });

	// return (
	// 	<SingleGalleryPage
	// 		gallery={{
	// 			id: "1",
	// 			name: "Mock Gallery",
	// 			images: [],
	// 		}}
	// 	/>
	// );
	return <SingleGalleryPage gallery={gallery} />;
}
