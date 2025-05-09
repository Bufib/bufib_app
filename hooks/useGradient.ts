// src/hooks/useGradient.ts
import { useState, useEffect } from "react";
import { newsArticleGradients } from "@/constants/Gradients";
import { UseGradientOptionsType} from "@/constants/Types";

export function useGradient(options: UseGradientOptionsType = {}) {
  const { customGradients, defaultIndex = 0 } = options;

  // Use custom gradients or defaults
  const gradients = customGradients || newsArticleGradients;

  // Set initial gradient
  const initialIndex = defaultIndex < gradients.length ? defaultIndex : 0;
  const [gradientColors, setGradientColors] = useState<any>(
    gradients[initialIndex]
  );

  // Function to select a random preset gradient
  const selectRandomPreset = () => {
    const randomIndex = Math.floor(Math.random() * gradients.length);
    setGradientColors(gradients[randomIndex]);
  };

  // Function to select a specific gradient by index
  const selectGradient = (index: number) => {
    if (index >= 0 && index < gradients.length) {
      setGradientColors(gradients[index]);
    }
  };

  // Initialize with a random gradient on mount
  useEffect(() => {
    selectRandomPreset();
  }, []);

  return {
    gradientColors,
    selectRandomPreset,
    selectGradient,
    availableGradients: gradients,
  };
}
