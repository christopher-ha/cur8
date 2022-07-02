import React from "react";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </>
    );
  }
  return (
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
  );
}
