import React, { useEffect, useRef } from "react";
import { Appearance } from "react-native";
import { usePathname } from "expo-router";

export function useMountLogger(name: string) {
  const idRef = useRef(Math.random().toString(36).slice(2, 8));
  const tag = `${name}#${idRef.current}`;

  useEffect(() => {
    console.log("[MOUNT]", tag);
    return () => console.log("[UNMOUNT]", tag);
  }, [tag]);

  // log every render
  useEffect(() => {
    console.log("[RENDER]", tag);
  });
}

export const Probe: React.FC<{ name: string; children: React.ReactNode }> = ({
  name,
  children,
}) => {
  useMountLogger(name);
  return <>{children}</>;
};

// Optional: hook to log current route (Expo Router)
export function useRouteLogger(prefix: string) {
  const path = usePathname();
  useEffect(() => {
    console.log("[ROUTE]", `${prefix} path = ${path}`);
  }, [path, prefix]);
}

// Optional: hook to log OS-level appearance changes
export function useAppearanceLogger(prefix: string) {
  useEffect(() => {
    const sub = Appearance.addChangeListener((e) => {
      console.log("[APPEARANCE]", `${prefix} scheme -> ${e.colorScheme}`);
    });
    return () => sub.remove();
  }, [prefix]);
}
