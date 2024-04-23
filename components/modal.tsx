import {
  Modal as BaseModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
// import useKeypress from "react-use-keypress";
// import type { ImageProps } from "../utils/types";
import SharedModal from "./shared-modal";

export default function Modal({
  images,
  onClose,
}: {
  images: any[];
  // images: ImageProps[];
  onClose?: () => void;
}) {
  let overlayRef = useRef();
  const router = useRouter();

  const { photoId } = router.query;
  let index = Number(photoId);

  const [direction, setDirection] = useState(0);
  const [curIndex, setCurIndex] = useState(index);

  function handleClose() {
    router.push("/", undefined, { shallow: true });
    // onClose();
  }

  function changePhotoId(newVal: number) {
    if (newVal > index) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setCurIndex(newVal);
    router.push(
      {
        query: { photoId: newVal },
      },
      `/p/${newVal}`,
      { shallow: true }
    );
  }

  // useKeypress("ArrowRight", () => {
  //   if (index + 1 < images.length) {
  //     changePhotoId(index + 1);
  //   }
  // });

  // useKeypress("ArrowLeft", () => {
  //   if (index > 0) {
  //     changePhotoId(index - 1);
  //   }
  // });

  return (
    <BaseModal
      // open={true}
      onClose={handleClose}
      // initialFocus={overlayRef}
      backdrop="blur"
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      <SharedModal
        index={curIndex}
        direction={direction}
        images={images}
        changePhotoId={changePhotoId}
        closeModal={handleClose}
        navigation={true}
      />
    </BaseModal>
  );
}
