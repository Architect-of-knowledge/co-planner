import { create } from "zustand";
export const useCart = create(() => ({ items: [] as string[] }));
