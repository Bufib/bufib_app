import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { defaultWeeklyTodos } from "./defaultWeeklyTodos";
import i18n from "@/utils/i18n";
import {
  TodoItemType,
  WeeklyTodosType,
  WeeklyCalendarSectionType,
  UseWeeklyTodosResult,
} from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";

const STORAGE_KEY = "prayer_app_weekly_todos";

export function useWeeklyTodos(): UseWeeklyTodosResult {
  // Use primary language from i18n.languages[0], fallback to 'de'
  const { language } = useLanguage();

  const [todosByDay, setTodosByDay] = useState<WeeklyTodosType>(
    () => defaultWeeklyTodos[language] ?? defaultWeeklyTodos.de
  );
  const [loading, setLoading] = useState(true);

  // Load saved todos on mount (and when primary language changes)
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (active && raw) {
          setTodosByDay(JSON.parse(raw));
        }
      } catch (e) {
        console.error("Failed to load todos:", e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [language]);

  // Persist todos whenever they change
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todosByDay)).catch((e) =>
        console.error("Failed to save todos:", e)
      );
    }
  }, [todosByDay, loading]);

  const toggleTodo = useCallback((day: number, id: number) => {
    setTodosByDay((prev) => ({
      ...prev,
      [day]:
        prev[day]?.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ) ?? [],
    }));
  }, []);

  const addTodo = useCallback((day: number, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newTodo: TodoItemType = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    };
    setTodosByDay((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), newTodo],
    }));
  }, []);

  const deleteTodo = useCallback((day: number, id: number) => {
    setTodosByDay((prev) => ({
      ...prev,
      [day]: (prev[day] || []).filter((todo) => todo.id !== id),
    }));
  }, []);

  const undoAllForDay = useCallback((day: number) => {
    setTodosByDay((prev) => ({
      ...prev,
      [day]: (prev[day] || []).map((todo) => ({ ...todo, completed: false })),
    }));
  }, []);

  return {
    todosByDay,
    loading,
    toggleTodo,
    addTodo,
    deleteTodo,
    undoAllForDay,
  };
}
