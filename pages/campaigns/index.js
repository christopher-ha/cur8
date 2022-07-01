import { useRouter } from "next/router";

export default function Campaign() {
  const router = useRouter();
  const campaignId = router.query.campaignId;
  return (
    <div>
      <p>This is where we will display all campaigns</p>
    </div>
  );
}
