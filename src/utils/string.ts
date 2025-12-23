/**
 * Truncates a string to the specified maximum length and appends an ellipsis if needed.
 *
 * @param text - The original string
 * @param maxLength - Maximum allowed length (default: 40)
 * @returns The truncated string
 */
export function truncate(text: string, maxLength: number = 40): string {
  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength)}...`
}
