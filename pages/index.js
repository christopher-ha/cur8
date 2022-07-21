import React from "react";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Head from "next/head";
import styles from "@/components/Home/Home.module.scss";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/campaigns");
    return (
      <>
        <Head>
          <title>cur8</title>
        </Head>
        <main className={styles.container}>
          {/* <p>Signed in as {session.user.email}</p> */}
          <button onClick={() => signOut()}>Sign Out</button>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>cur8</title>
      </Head>
      <main className={styles.container}>
        <div>
          <Link href="/auth/signup">
            <button>Create an Account</button>
          </Link>

          <button onClick={() => signIn("EmailProvider", { redirect: false })}>
            Log In
          </button>
        </div>
      </main>
    </>
  );
}
