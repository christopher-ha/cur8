import Link from "next/link";

export default function verifyRequest({ baseUrl }) {
  return (
    <div className="verify-request">
      <p>Check your email</p>
      <Link href="/">
        <p>Return home</p>
      </Link>
    </div>
  );
}
