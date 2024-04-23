import { Card, CardBody } from "@nextui-org/card";
import { Gallery } from "@prisma/client";
import React from "react";

export default function GalleryCard({ name }: Partial<Gallery>) {
  return (
    <Card isPressable>
      <CardBody>
        <p>{name}</p>
        <p>{name}</p>
      </CardBody>
    </Card>
  );
}
