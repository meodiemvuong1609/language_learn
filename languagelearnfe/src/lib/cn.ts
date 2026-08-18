import { clsx } from 'clsx';

export function cn(...inputs: (string | undefined | false | null | Record<string, boolean>)[]) {
  return clsx(inputs);
}
