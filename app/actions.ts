"use server";

export async function createGallery({ name }: { name: string }) {
	const slug = name
		.toLowerCase() // Convert to lowercase
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/[^\w\-]+/g, "") // Remove non-word characters except hyphens
		.replace(/\-\-+/g, "-") // Replace multiple hyphens with single hyphen
		.replace(/^-+/, "") // Remove leading hyphens
		.replace(/-+$/, ""); // Remove trailing hyphens
	const newGallery = await prisma?.gallery.create({
		data: {
			name,
			slug,
		},
	});
}
