import { useRouter } from "next/router";

export default function Images() {
  const router = useRouter();
  const { campaignId, moodboardId } = router.query;
  console.log(router.query);
  return (
    <div>
      <p>This is a single moodboard. Here is the ID: {moodboardId}</p>
    </div>
  );
}
