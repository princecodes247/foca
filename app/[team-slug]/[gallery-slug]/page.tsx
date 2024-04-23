import { title } from "@/components/primitives";

export default async function GalleryPage({params}: {params: { 'team-slug': string, 'gallery-slug': string }}) {
  console.log({params})
  const gallery = await prisma?.gallery.findFirst({
    where: {
      slug: params["gallery-slug"]
    }
  })
  return (
    <div>
      <h1 className={title()}>{gallery?.name}</h1>
    </div>
  );
}
