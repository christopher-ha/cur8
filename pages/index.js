import React from "react";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Head from "next/head";

export default function Home() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <Head>
          <title>cur8</title>
        </Head>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </>
    );
  }
  return (
    <>
      <Head>
        <title>cur8</title>
      </Head>
      <main>
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
