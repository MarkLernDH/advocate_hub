import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ErrorHandlerOptions {
  toast?: {
    toast: (options: { title: string; description?: string; variant: 'error' }) => void;
  };
  defaultMessage?: string;
}

export function handleError(error: unknown, options: ErrorHandlerOptions) {
  console.error('Error:', error)
  
  const message = error instanceof Error ? error.message : options.defaultMessage || 'An error occurred'
  
  if (options.toast) {
    options.toast.toast({
      title: 'Error',
      description: message,
      variant: 'error'
    })
  }
  
  return message
}

export function formatPoints(points: number): string {
  return new Intl.NumberFormat('en-US').format(points)
}

export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
