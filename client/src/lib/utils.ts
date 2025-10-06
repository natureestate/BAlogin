import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * ฟังก์ชันสำหรับรวม class names โดยใช้ clsx และ tailwind-merge
 * @param inputs - class names ที่ต้องการรวม
 * @returns class names ที่รวมแล้ว
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

