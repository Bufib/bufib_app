// AppReviewPrompt.tsx
import React, { useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import * as StoreReview from 'expo-store-review';
import useAppReviewStore from '@/stores/useAppReviewStore';

const AppReviewPrompt: React.FC = () => {
  const {
    installDate,
    setInstallDate,
    setHasRated,
    setRemindLaterDate,
    isEligibleForReview,
  } = useAppReviewStore();

  // On first app load, set the install date if not set yet.
  useEffect(() => {
    if (!installDate) {
      setInstallDate(Date.now());
    }
  }, [installDate, setInstallDate]);

  // Function to trigger the review prompt
  const triggerReviewPrompt = async () => {
    if (isEligibleForReview()) {
      // Check if the native in-app review is available.
      if (await StoreReview.isAvailableAsync()) {
        try {
          await StoreReview.requestReview();
          // Mark that the user has rated the app.
          setHasRated(true);
        } catch (error) {
          console.error('Error requesting in-app review:', error);
        }
      } else {
        // Fallback: open the store URL if native review is unavailable.
        const storeURL =
        Platform.OS === "ios"
          ? "https://apps.apple.com/de/app/islam-fragen/id6737857116"
          : "https://play.google.com/store/apps/details?id=com.bufib.islamFragen&pcampaignid=web_share";
        await Linking.openURL(storeURL);
        setHasRated(true);
      }
    }
  };

  // Instead of triggering immediately, wait (for example, 30 seconds) before checking.
  useEffect(() => {
    const delayInMs = 10000; // Delay of 10 seconds
    const timer = setTimeout(() => {
      triggerReviewPrompt();
    }, delayInMs);

    return () => clearTimeout(timer);
  }, [isEligibleForReview, setHasRated, setRemindLaterDate]);

  return null; // No UI is rendered by this component
};

export default AppReviewPrompt;
