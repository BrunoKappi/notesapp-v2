import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNoteColorClass(hexColor: string | undefined): string {
  const mapping: Record<string, string> = {
    '#F28B82': 'var(--note-red)',
    '#FBBC05': 'var(--note-orange)',
    '#FFF475': 'var(--note-yellow)',
    '#CCFF90': 'var(--note-green)',
    '#A7FFEB': 'var(--note-teal)',
    '#CBF0F8': 'var(--note-blue-light)',
    '#AECBFA': 'var(--note-blue)',
    '#D7AEFB': 'var(--note-purple)',
    '#E6C9A8': 'var(--note-brown)',
    '#E8EAED': 'var(--note-grey)',
    '#FFFFFF': 'var(--note-white)',
  };
  return mapping[(hexColor || '').toUpperCase()] || 'var(--note-white)';
}
