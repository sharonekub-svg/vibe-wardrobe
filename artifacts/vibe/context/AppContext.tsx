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
  budget: number;
}

export interface FashionItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  brand: string;
  category: string;
}

interface AppContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  likedItems: FashionItem[];
  addLikedItem: (item: FashionItem) => void;
  clearLikedItems: () => void;
  isSubscribed: boolean;
  setIsSubscribed: (val: boolean) => void;
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
        if (profileJson) {
          setUserProfileState(JSON.parse(profileJson));
        }
        const sub = await AsyncStorage.getItem(SUBSCRIBED_KEY);
        if (sub === "true") setIsSubscribedState(true);
      } catch (_e) {}
    })();
  }, []);

  const setUserProfile = useCallback(async (profile: UserProfile) => {
    setUserProfileState(profile);
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (_e) {}
  }, []);

  const addLikedItem = useCallback((item: FashionItem) => {
    setLikedItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const clearLikedItems = useCallback(() => {
    setLikedItems([]);
  }, []);

  const setIsSubscribed = useCallback(async (val: boolean) => {
    setIsSubscribedState(val);
    try {
      await AsyncStorage.setItem(SUBSCRIBED_KEY, val ? "true" : "false");
    } catch (_e) {}
  }, []);

  const resetSession = useCallback(() => {
    setLikedItems([]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserProfile,
        likedItems,
        addLikedItem,
        clearLikedItems,
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
