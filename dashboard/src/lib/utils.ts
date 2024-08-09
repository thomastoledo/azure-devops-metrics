import { ALL } from "@/lib/constants";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toFixedPercentage = (value: number, total: number) =>toRawPercentage(value, total).toFixed(2);
export const toRawPercentage = (value: number, total: number) => ((value * 100) / total);
export const randomHexColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
export const filterAgainstItem = <T>(item: T, referenceItem?: T) => referenceItem === ALL || !referenceItem || referenceItem === item;