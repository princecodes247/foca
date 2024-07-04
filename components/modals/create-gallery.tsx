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

import { convertToSlug } from "@/lib/utils";
import useDebounceCallback from "@/hooks/use-debounce-callback";
import { createGallery } from "@/actions/gallery.actions";

enum SlugStatus {
	VALID = "valid",
	INVALID = "invalid",
	PENDING = "pending",
}

export default function CreateAlbumModal() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [albumName, setAlbumName] = useState("");
	const [albumSlug, setAlbumSlug] = useState("");
	const [slugStatus, setSlugStatus] = useState<SlugStatus>(SlugStatus.INVALID);

	const debouncedCheckForSlug = useDebounceCallback((value: string) => {
		// setSlugStatus(SlugStatus.PENDING);

		// Do something with debounced value, like making an API call
		setSlugStatus(SlugStatus.VALID);
		console.log("Debounced value:", value);
	}, 500);

	const handleChangeName = (value: string) => {
		const newSlug = convertToSlug(value.trim());
		if (newSlug.includes(albumSlug) || albumSlug.includes(newSlug))
			handleChangeSlug(newSlug);
		setAlbumName(value);
	};

	const handleChangeSlug = (value: string) => {
		setSlugStatus(SlugStatus.PENDING);
		setAlbumSlug(value);
		debouncedCheckForSlug(value);
	};
	return (
		<>
			<Button
				variant="flat"
				color="warning"
				onPress={() => onOpen()}
				className="capitalize"
			>
				Create Gallery
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
									onChange={(e) => handleChangeName(e.target.value)}
								/>
								<Input
									placeholder="Album Slug"
									value={albumSlug}
									onChange={(e) =>
										handleChangeSlug(convertToSlug(e.target.value.trim()))
									}
								/>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button
									color="primary"
									onPress={async () => {
										if (
											slugStatus !== SlugStatus.VALID ||
											albumName.trim().length === 0
										)
											return;
										const res = await createGallery({ name: albumName });
										console.log({ res });
										onClose();
									}}
									disabled={
										slugStatus !== SlugStatus.VALID ||
										albumName.trim().length === 0
									}
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
