import React, { useEffect } from "react";
import { Redirect } from "expo-router";

const index = () => {
  return <Redirect href="/(tabs)/home/" />;
};
export default index;


// import React, { useEffect, useState } from "react";
// import { Redirect } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function Index() {
//   const [href, setHref] = useState<string | null>(null);

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const hasLaunched = await AsyncStorage.getItem("hasLaunched");
//         if (!hasLaunched) {
//           await AsyncStorage.setItem("hasLaunched", "true");
//           if (mounted) setHref("/onboarding");      // absolute path
//         } else {
//           if (mounted) setHref("/(tabs)/home");      // your normal landing
//         }
//       } catch {
//         if (mounted) setHref("/(tabs)/home");
//       }
//     })();
//     return () => { mounted = false; };
//   }, []);

//   if (!href) return null; 
//   return <Redirect href={href} />;
// }
