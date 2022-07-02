import AuthNewUser from "@/components/Forms/AuthNewUser/AuthNewUser";
// import { prisma } from "@/utils/db";

// export async function getServerSideProps() {
//   const
// };

// const submitHandler = (values) => {
//   console.log(values);
// };

export default function newUser({ baseUrl }) {
  return <AuthNewUser />;
}
