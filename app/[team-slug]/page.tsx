import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import GalleryCard from "./_components/gallery-card";
import CreateGalleryModal from "@/components/modals/create-gallery";

export default async function OverviewPage() {
  const galleries = (await prisma?.gallery.findMany()) ?? []
  console.log({galleries})
  return (
    <div>
      <h1 className={title()}>Overview</h1>

      {galleries?.map(gallery => (
        <GalleryCard name={gallery.name}/>
      ))}

{galleries?.length === 0 && (
  <p>No Gallery found</p>
)}

<CreateGalleryModal/>
      <Button>
        Create Gallery
      </Button>
    </div>
  );
}
