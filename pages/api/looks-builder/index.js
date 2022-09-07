import { prisma } from "@/utils/db";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await saveLook(req, res);
  }
}

async function saveLook(req, res) {
  const session = await getSession({ req });
  const userId = session.user.id;

  const {
    face,
    top1,
    top2,
    bottom,
    shoes,
    accessory1,
    accessory2,
    accessory3,
    accessory4,
    campaignId,
  } = req.body;

  console.log(
    face,
    top1,
    top2,
    bottom,
    shoes,
    accessory1,
    accessory2,
    accessory3,
    accessory4,
    campaignId
  );

  try {
    console.log(req.body);

    // Store the ids of the models face and items inside of the database.
    const look = await prisma.savedLooks.create({
      data: {
        campaignId: campaignId,
        modelId: face,
        top1Id: top1,
        top2Id: top2,
        bottomId: bottom,
        shoesId: shoes,
        accessory1Id: accessory1,
        accessory2Id: accessory2,
        accessory3Id: accessory3,
        accessory4Id: accessory4,
      },
    });
    return res.status(200).json(look, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error creating campaign", success: false });
  }
}
