import React from "react";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

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
        <button onClick={() => signIn("EmailProvider", { redirect: false })}>
          Sign In
        </button>
      </div>
    </main>
  );
}
