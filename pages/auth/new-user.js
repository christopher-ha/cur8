import Head from "next/head";
import AuthNewUser from "@/components/Forms/AuthNewUser/AuthNewUser";

export default function NewUser() {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <AuthNewUser />;
    </>
  );
}
