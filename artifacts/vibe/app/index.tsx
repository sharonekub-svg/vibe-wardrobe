import { useApp } from "@/context/AppContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function RootIndex() {
  const { userProfile } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (userProfile) {
      router.replace("/(main)/swipe");
    } else {
      router.replace("/onboarding");
    }
  }, [userProfile]);

  return null;
}
