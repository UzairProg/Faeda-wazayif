/**
 * features/public/types/contact.types.ts
 *
 * TypeScript types for the public Contact Us module.
 */

export interface ContactFormValues {
  name: string
  email: string
  reason: string
  message: string
}

export interface ContactSubmitResponse {
  success: boolean
  message: string
}
