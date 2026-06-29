import GarageRemote from "@/components/garage/garage-remote";
import { getGarageStatus } from "@/lib/garage-api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialStatus = await getGarageStatus();

  return (
    <GarageRemote
      initialStatus={initialStatus.available ? "green" : "red"}
    />
  );
}
