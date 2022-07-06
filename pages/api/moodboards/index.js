import { prisma } from "@/utils/db";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default async function Handle(req, res) {
  const { url, text, moodboardId } = req.body;
  // console.log(url, text, moodboardId);
  console.log("url", url);
  console.log("text", text);
  console.log("moodboardId", moodboardId);

  const images = await prisma.images.create({
    data: {
      moodboardId: moodboardId,
      url: url,
      text: text,
    },
  });

  res.json({ images });
}
