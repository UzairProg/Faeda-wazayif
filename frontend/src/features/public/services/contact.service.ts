/**
 * features/public/services/contact.service.ts
 *
 * Service function for submitting the public contact form to /api/v1/contact.
 */
import { apiClient as api } from "@/lib/api-client"
import { API_CONFIG } from "@/config/api"
import type { ContactFormValues, ContactSubmitResponse } from "../types/contact.types"

export async function submitContactForm(formValues: ContactFormValues): Promise<ContactSubmitResponse> {
  const { data } = await api.post<ContactSubmitResponse>(API_CONFIG.ENDPOINTS.CONTACT, formValues)
  return data
}
