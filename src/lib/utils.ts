import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ToastOptions {
  title: string
  description?: string
  variant: 'error'
}

interface ErrorHandlerOptions {
  toast: (options: ToastOptions) => void
  defaultMessage: string
}

export function handleError(error: unknown, { toast, defaultMessage }: ErrorHandlerOptions) {
  console.error(error)
  toast({
    title: error instanceof Error ? error.message : defaultMessage,
    variant: 'error'
  })
}

export function formatPoints(points: number): string {
  return new Intl.NumberFormat('en-US').format(points)
}

export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
