import { prisma } from "@/utils/db";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
  const session = await getSession({
    req,
  });
  const userId = session.user.id;

  const { name, instagram, number } = req.body;
  console.log(name, instagram, number);

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      instagram,
      number,
    },
  });
  res.json(result);

  // if (!session) {
  //   res.status(401).json({
  //     error: "Unauthenticated user",
  //   });
  // } else {
  //   res.status(200).json({
  //     message: "Success",
  //     userId,
  //   });
  // }
}
