import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
interface CompletedLevels {
  [sectionTitle: string]: {
    [levelIndex: number]: boolean;
  };
}

interface SectionProgress {
  completed: number;
  total: number;
  percentage: number;
}

type LevelStatus = 'locked' | 'active' | 'completed';

interface LevelProgressState {
  completedLevels: CompletedLevels;
  
  // Actions
  markLevelComplete: (sectionTitle: string, levelIndex: number) => void;
  markLevelIncomplete: (sectionTitle: string, levelIndex: number) => void;
  resetSection: (sectionTitle: string) => void;
  resetAllProgress: () => void;
  
  // Selectors
  isLevelComplete: (sectionTitle: string, levelIndex: number) => boolean;
  getLevelStatus: (sectionTitle: string, levelIndex: number) => LevelStatus;
  getActiveLevel: (sectionTitle: string) => number;
  getSectionProgress: (sectionTitle: string, totalLevels: number) => SectionProgress;
  getTotalProgress: (sections: { title: string; totalLevels: number }[]) => SectionProgress;
  getCompletedLevelsInSection: (sectionTitle: string) => number[];
}

export const useLevelProgressStore = create<LevelProgressState>()(
  persist(
    (set, get) => ({
      completedLevels: {},
      
      // Mark a specific level as complete
      markLevelComplete: (sectionTitle: string, levelIndex: number) => {
        set((state) => ({
          completedLevels: {
            ...state.completedLevels,
            [sectionTitle]: {
              ...state.completedLevels[sectionTitle],
              [levelIndex]: true,
            },
          },
        }));
      },
      
      // Mark a specific level as incomplete
      markLevelIncomplete: (sectionTitle: string, levelIndex: number) => {
        set((state) => ({
          completedLevels: {
            ...state.completedLevels,
            [sectionTitle]: {
              ...state.completedLevels[sectionTitle],
              [levelIndex]: false,
            },
          },
        }));
      },
      
      // Reset all progress for a specific section
      resetSection: (sectionTitle: string) => {
        set((state) => ({
          completedLevels: {
            ...state.completedLevels,
            [sectionTitle]: {},
          },
        }));
      },
      
      // Reset all progress across all sections
      resetAllProgress: () => {
        set({ completedLevels: {} });
      },
      
      // Check if a specific level is complete
      isLevelComplete: (sectionTitle: string, levelIndex: number) => {
        const state = get();
        return state.completedLevels[sectionTitle]?.[levelIndex] ?? false;
      },
      
      // Get the status of a specific level (locked, active, or completed)
      getLevelStatus: (sectionTitle: string, levelIndex: number): LevelStatus => {
        const state = get();
        const sectionData = state.completedLevels[sectionTitle] || {};
        
        // If this level is completed, return completed
        if (sectionData[levelIndex] === true) {
          return 'completed';
        }
        
        // If this is the first level (index 0), it's always active
        if (levelIndex === 0) {
          return 'active';
        }
        
        // Check if previous level is completed
        const previousLevelCompleted = sectionData[levelIndex - 1] === true;
        
        if (previousLevelCompleted) {
          return 'active';
        } else {
          return 'locked';
        }
      },
      
      // Get the currently active (next available) level for a section
      getActiveLevel: (sectionTitle: string): number => {
        const state = get();
        const sectionData = state.completedLevels[sectionTitle] || {};
        
        // Find the first incomplete level
        let activeLevel = 0;
        while (sectionData[activeLevel] === true) {
          activeLevel++;
        }
        
        return activeLevel;
      },
      
      // Get progress statistics for a specific section
      getSectionProgress: (sectionTitle: string, totalLevels: number): SectionProgress => {
        const state = get();
        const sectionData = state.completedLevels[sectionTitle] || {};
        const completed = Object.values(sectionData).filter(Boolean).length;
        
        return {
          completed,
          total: totalLevels,
          percentage: totalLevels > 0 ? Math.round((completed / totalLevels) * 100) : 0,
        };
      },
      
      // Get total progress across all sections
      getTotalProgress: (sections: { title: string; totalLevels: number }[]): SectionProgress => {
        const state = get();
        let totalCompleted = 0;
        let totalLevels = 0;
        
        sections.forEach(({ title, totalLevels: sectionTotal }) => {
          const sectionData = state.completedLevels[title] || {};
          const sectionCompleted = Object.values(sectionData).filter(Boolean).length;
          totalCompleted += sectionCompleted;
          totalLevels += sectionTotal;
        });
        
        return {
          completed: totalCompleted,
          total: totalLevels,
          percentage: totalLevels > 0 ? Math.round((totalCompleted / totalLevels) * 100) : 0,
        };
      },
      
      // Get array of completed level indices for a section
      getCompletedLevelsInSection: (sectionTitle: string): number[] => {
        const state = get();
        const sectionData = state.completedLevels[sectionTitle] || {};
        return Object.entries(sectionData)
          .filter(([_, isComplete]) => isComplete)
          .map(([index, _]) => parseInt(index));
      },
    }),
    {
      name: 'level-progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper hook for easier access to level-specific operations
export const useLevelProgress = (sectionTitle: string, levelIndex: number) => {
  const store = useLevelProgressStore();
  
  return {
    isComplete: store.isLevelComplete(sectionTitle, levelIndex),
    status: store.getLevelStatus(sectionTitle, levelIndex),
    markComplete: () => store.markLevelComplete(sectionTitle, levelIndex),
    markIncomplete: () => store.markLevelIncomplete(sectionTitle, levelIndex),
  };
};