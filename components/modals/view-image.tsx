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
import { EyeIcon, HeartIcon } from "lucide-react";
import type { Image as AlbumImage } from "@prisma/client";


export default function ViewImageModal({ image, isOpen, onClose }: { image?: AlbumImage, isOpen: boolean, onClose: () => void }) {

	return (
		<>

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
							</ModalHeader>
							<ModalBody>
								{image && <img src={image.url} alt="Image" width={720} height={480} />}
							</ModalBody>
							<ModalFooter>
								<div
									className="flex items-center font-semibold  text-xs gap-1 "
								>
									<EyeIcon size={15} />
									<p>{image?.views ?? 0} Views</p>
								</div>
								<Button variant="ghost"
									// onPress={onClose}

									className="flex items-center gap-1 text-xs border-transparent"
								>
									<HeartIcon size={15} />
									<p>{image?.likes ?? 0} Like</p>
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
