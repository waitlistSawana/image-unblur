import { requireClerk } from "~/actions/auth";
import OnboardingPageComponent from "./page-component";

export default async function OnboardingPage() {
  const { clerkId } = await requireClerk();

  return (
    <div id="OnboardingPage">
      <OnboardingPageComponent clerkId={clerkId} />
    </div>
  );
}
