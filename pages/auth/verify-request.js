import Link from "next/link";

export default function verifyRequest({ baseUrl }) {
  return (
    <div className="verify-request">
      <h5>Check your email for a magic link</h5>
      <Link href="/">
        <p>Return home</p>
      </Link>
    </div>
  );
}
