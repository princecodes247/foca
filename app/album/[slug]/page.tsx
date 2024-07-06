import { notFound } from "next/navigation";
import AlbumPage from "./AlbumPage";

export default async function SingleGalleryPage({
	params,
}: {
	params: { slug: string };
}) {
	const gallery = await prisma?.gallery.update({
		where: {
			slug: params?.slug,
			isPublished: true,
		},
		data: {
			views: { increment: 1 },
		},
		include: {
			images: true,
		},
	});

	if (!gallery) return notFound();

	return <AlbumPage gallery={gallery} />;
}
