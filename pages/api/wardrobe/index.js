import { prisma } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await CreateItem(req, res);
  } else if (req.method === "DELETE") {
    return await deleteItem(req, res);
  }
}

async function CreateItem(req, res) {
  const { brand, description, size, category, url, campaignId } = req.body.data;

  try {
    const createItem = await prisma.wardrobe.create({
      data: {
        campaignId: campaignId,
        brand: brand,
        description: description,
        size: size,
        category: category,
        url: url,
      },
    });

    return res.status(200).json(createItem, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error creating item", success: false });
  }
}

// async function deleteItem(req, res) {
//   const { selected } = req.body;

//   try {
//     const deleteItem = await prisma.images.delete({
//       where: {
//         id: selected,
//       },
//     });
//     return res.status(200).json(deleteItem, { success: true });
//   } catch (error) {
//     console.error("Request error", error);
//     res.status(500).json({ error: "Error deleting item", success: false });
//   }
// }
