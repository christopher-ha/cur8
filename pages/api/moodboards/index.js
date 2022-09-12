import { prisma } from "@/utils/db";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await createMoodboard(req, res);
  } else if (req.method === "DELETE") {
    return await deleteMoodboard(req, res);
  }
}

async function createMoodboard(req, res) {
  const { campaignId, name } = req.body.data;

  try {
    const createMoodboard = await prisma.moodboards.create({
      data: {
        campaignId: campaignId,
        name: name,
      },
    });
    return res.status(200).json(createMoodboard, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error creating item", success: false });
  }
}

async function deleteMoodboard(req, res) {
  const { selected } = req.body;

  try {
    const deleteMoodboard = await prisma.moodboards.delete({
      where: {
        id: selected,
      },
    });
    return res.status(200).json(deleteMoodboards, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error deleting item", success: false });
  }
}
