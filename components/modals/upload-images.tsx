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
import { createGallery } from "@/app/actions";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import { ActualFileObject, FilePondFile, FilePondInitialFile } from "filepond";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "@/styles/upload.css";
import { putFileServer } from "@/actions/upload.actions";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

enum SlugStatus {
	VALID = "valid",
	INVALID = "invalid",
	PENDING = "pending",
}

export default function UploadImagesModal() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [files, setFiles] = useState<Blob[]>([]);

	return (
		<>
			<Button
				variant="flat"
				color="warning"
				onPress={() => onOpen()}
				className="capitalize"
			>
				Upload Images
			</Button>
			<Modal
				backdrop="blur"
				isOpen={isOpen}
				// isOpen={true}
				onClose={onClose}
				size="3xl"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Upload Images
							</ModalHeader>
							<ModalBody>
								<div>
									<label>
										<p className="text-center">
											Drag & Drop your files or{" "}
											<span className="underline">Browse</span>
										</p>
										<FilePond
											files={files}
											onupdatefiles={(files) =>
												setFiles(files.map((file) => file.file))
											}
											allowMultiple={true}
											maxFiles={3}
											server={{
												process: async (
													fieldName,
													file,
													metadata,
													load,
													error,
													progress,
													abort,
													transfer,
													options,
												) => {
													console.log({ file });
													const formData = new FormData();
													formData.set("file", file);
													const { data } = await putFileServer(formData);
													load(data?.url ?? "");
												},
											}}
											name="files" /* sets the file input name, it's filepond by default */
											labelIdle=""
											className="min-h-[300px] bg-black/20 mt-2 rounded-lg"
										/>
									</label>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button
									color="primary"
									onPress={async () => {
										// const res = await createGallery({ name: albumName });
										// console.log({ res });
										onClose();
									}}
									disabled={false}
								>
									Save
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
