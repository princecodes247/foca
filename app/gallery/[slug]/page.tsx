import { title } from "@/components/primitives";

export default function SingleGalleryPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1 className={title()}>Gallery - {params?.slug}</h1>
    </div>
  );
}
