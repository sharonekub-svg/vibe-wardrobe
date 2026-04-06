import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface UserProfile {
  name: string;
  age: number;
}

export interface FashionItem {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  imageUrl: string;
  category: string;
  buyUrl: string;
  tags?: string[];
  collection?: string;
}

interface AppContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  likedItems: FashionItem[];
  addLikedItem: (item: FashionItem) => void;
  clearLikedItems: () => void;
  /** Aggregated tags from all liked items — drives the personalized shop */
  likedTags: string[];
  isSubscribed: boolean;
  setIsSubscribed: (val: boolean) => void;
  /** Call on new login to clear the current session's swipe history */
  resetSession: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const PROFILE_KEY = "vibe_user_profile";
const SUBSCRIBED_KEY = "vibe_subscribed";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [likedItems, setLikedItems] = useState<FashionItem[]>([]);
  const [isSubscribed, setIsSubscribedState] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const profileJson = await AsyncStorage.getItem(PROFILE_KEY);
        if (profileJson) setUserProfileState(JSON.parse(profileJson));
        const sub = await AsyncStorage.getItem(SUBSCRIBED_KEY);
        if (sub === "true") setIsSubscribedState(true);
      } catch (e) { console.error("[AppContext] load", e); }
    })();
  }, []);

  const setUserProfile = useCallback(async (profile: UserProfile) => {
    setUserProfileState(profile);
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (e) { console.error("[AppContext] setUserProfile", e); }
  }, []);

  const addLikedItem = useCallback((item: FashionItem) => {
    setLikedItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const clearLikedItems = useCallback(() => setLikedItems([]), []);

  const setIsSubscribed = useCallback(async (val: boolean) => {
    setIsSubscribedState(val);
    try {
      await AsyncStorage.setItem(SUBSCRIBED_KEY, val ? "true" : "false");
    } catch (e) { console.error("[AppContext] setIsSubscribed", e); }
  }, []);

  const resetSession = useCallback(() => setLikedItems([]), []);

  const likedTags: string[] = React.useMemo(() => {
    const freq: Record<string, number> = {};
    for (const item of likedItems) {
      for (const tag of item.tags ?? []) {
        freq[tag] = (freq[tag] ?? 0) + 1;
      }
    }
    return Object.keys(freq).sort((a, b) => (freq[b] ?? 0) - (freq[a] ?? 0));
  }, [likedItems]);

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserProfile,
        likedItems,
        addLikedItem,
        clearLikedItems,
        likedTags,
        isSubscribed,
        setIsSubscribed,
        resetSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
