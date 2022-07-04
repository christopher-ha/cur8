import { prisma } from "@/utils/db";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
  const session = await getSession({
    req,
  });
  const userId = session.user.id;

  const { name, role, instagram, number } = req.body;
  console.log(name, role, instagram, number);

  // Find the current logged in user and update their information using the form data.
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      role,
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
