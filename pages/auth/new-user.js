import Head from "next/head";
import AuthNewUser from "@/components/Forms/AuthNewUser/AuthNewUser";
import Header from "@/components/Header/Header";

export default function NewUser() {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Header title={"Profile"} logoVisible={false} />
      <AuthNewUser />
    </>
  );
}
