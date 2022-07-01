import { useRouter } from "next/router";

export default function Campaign() {
  const router = useRouter();
  const campaignId = router.query.campaignId;
  return (
    <div>
      <p>This is a single campaign. Here is the ID: {campaignId}</p>
    </div>
  );
}
