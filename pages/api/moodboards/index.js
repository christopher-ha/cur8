import { prisma } from "@/utils/db";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default async function Handle(req, res) {
  const { url, moodboardId } = req.body;
  console.log(url, moodboardId);

  const images = await prisma.images.create({
    data: {
      moodboardId: moodboardId,
      url: url,
    },
  });

  res.json({ images });
}
