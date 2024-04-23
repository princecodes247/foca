"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { createGallery } from "@/app/actions";

export default function CreateAlbumModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [albumName, setAlbumName] = useState("");
  return (
    <>
      <Button
        variant="flat"
        color="warning"
        onPress={() => onOpen()}
        className="capitalize"
      >
        Open
      </Button>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        // isOpen={true}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Album
              </ModalHeader>
              <ModalBody>
                <Input
                  placeholder="Album Name"
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                />
                <Input placeholder="Album Name" />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={async () => {
                    const res = await createGallery({ name: albumName });
                    console.log({ res });
                    onClose();
                  }}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
