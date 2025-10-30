// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { whenDatabaseReady } from "@/db";
// import { fetchVersionFromSupabase } from "@/db/sync/versions";
// import syncQuestions from "@/db/sync/questions";
// import syncQuran from "@/db/sync/quran";
// import syncCalendar from "@/db/sync/calendar";
// import syncPrayers from "@/db/sync/prayers";
// import syncPayPal from "@/db/sync/paypal";
// import type { LanguageCode } from "@/constants/Types";

// /**
//  * Core dataset sync:
//  * - waits for DB
//  * - fetches remote versions
//  * - for each dataset: compare remote vs local + language flag → sync if needed
//  * - refreshes PayPal
//  * - returns { didWork } (true if any dataset actually synced)
//  *
//  * No UI, no navigation.
//  */
// export async function runDatabaseSync(
//   lang: LanguageCode
// ): Promise<{ didWork: boolean }> {
//   await whenDatabaseReady();

//   const remote = await fetchVersionFromSupabase();
//   if (!remote) return { didWork: false };

//   const {
//     question_data_version: questionsVer,
//     quran_data_version: quranVer,
//     calendar_data_version: calendarVer,
//     prayer_data_version: prayerVer,
//   } = remote;

//   let didWork = false;

//   // Only sync when version changed OR first time for this language at that version.
//   const syncDataset = async (
//     storedVersionKey: string, // e.g. "question_data_version"
//     langMarkerPrefix: string, // e.g. "synced_questions"
//     remoteVersion: string | null | undefined,
//     runSync: () => Promise<unknown>,
//     languageScoped: boolean = true
//   ) => {
//     if (!remoteVersion) return;

//     const storedVersion = await AsyncStorage.getItem(storedVersionKey);
//     const versionChanged = remoteVersion !== storedVersion;

//     const langKey = languageScoped
//       ? `${langMarkerPrefix}_${lang}_${remoteVersion}`
//       : `${langMarkerPrefix}_${remoteVersion}`;

//     const alreadySyncedLang = await AsyncStorage.getItem(langKey);

//     if (versionChanged || !alreadySyncedLang) {
//       await runSync(); // do the actual dataset import/update
//       await AsyncStorage.setItem(storedVersionKey, remoteVersion);
//       await AsyncStorage.setItem(langKey, "true");
//       didWork = true;
//     }
//   };

//   // Run sequentially to avoid SQLite locks
//   await syncDataset(
//     "question_data_version",
//     "synced_questions",
//     questionsVer,
//     () => syncQuestions(),
//     true
//   );
//   await syncDataset(
//     "quran_data_version",
//     "synced_quran",
//     quranVer,
//     () => syncQuran(),
//     true
//   );
//   await syncDataset(
//     "calendar_data_version",
//     "synced_calendar",
//     calendarVer,
//     () => syncCalendar(),
//     true
//   );
//   await syncDataset(
//     "prayer_data_version",
//     "synced_prayers",
//     prayerVer,
//     () => syncPrayers(),
//     true
//   );

//   // Always refresh PayPal (cheap; adapt to your needs if you want a signature check)
//   await syncPayPal();

//   return { didWork };
// }

// src/db/runDatabaseSync.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { whenDatabaseReady } from "@/db";
import { fetchVersionFromSupabase } from "@/db/sync/versions";
import syncQuestions from "@/db/sync/questions";
import syncQuran from "@/db/sync/quran";
import syncCalendar from "@/db/sync/calendar";
import syncPrayers from "@/db/sync/prayers";
import syncPayPal from "@/db/sync/paypal";

export async function runDatabaseSync(): Promise<{ didWork: boolean }> {
  await whenDatabaseReady();

  const remote = await fetchVersionFromSupabase();
  if (!remote) return { didWork: false };

  const {
    question_data_version: questionsVer,
    quran_data_version: quranVer,
    calendar_data_version: calendarVer,
    prayer_data_version: prayerVer,
  } = remote;

  let didWork = false;

  const syncDataset = async (
    storedVersionKey: string, // e.g. "question_data_version"
    markerPrefix: string, // e.g. "synced_questions"
    remoteVersion?: string | null,
    runSync?: () => Promise<unknown>
  ) => {
    if (!remoteVersion || !runSync) return;

    const storedVersion = await AsyncStorage.getItem(storedVersionKey);
    const versionChanged = remoteVersion !== storedVersion;

    // language-agnostic marker
    const markerKey = `${markerPrefix}_${remoteVersion}`;
    const alreadySynced = await AsyncStorage.getItem(markerKey);

    if (versionChanged || !alreadySynced) {
      await runSync();
      await AsyncStorage.setItem(storedVersionKey, remoteVersion);
      await AsyncStorage.setItem(markerKey, "true");
      didWork = true;
    }
  };

  // Sequential to avoid SQLite locks
  await syncDataset(
    "question_data_version",
    "synced_questions",
    questionsVer,
    () => syncQuestions()
  );
  await syncDataset("quran_data_version", "synced_quran", quranVer, () =>
    syncQuran()
  );
  await syncDataset(
    "calendar_data_version",
    "synced_calendar",
    calendarVer,
    () => syncCalendar()
  );
  await syncDataset("prayer_data_version", "synced_prayers", prayerVer, () =>
    syncPrayers()
  );

  // Always refresh PayPal
  await syncPayPal();

  return { didWork };
}
