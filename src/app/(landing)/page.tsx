import { isAuthenticated } from "@/lib/session";
import LandingPage from "./landing-client";

export default async function Page() {
  const authed = await isAuthenticated();
  return <LandingPage isAuthed={authed} />;
}
