/**
 * features/public/services/contact.service.ts
 *
 * Service function for submitting the public contact form to /api/v1/contact.
 */
import axios from "axios"
import { API_CONFIG } from "@/config/api"
import type { ContactFormValues, ContactSubmitResponse } from "../types/contact.types"

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  withCredentials: true,
})

export async function submitContactForm(formValues: ContactFormValues): Promise<ContactSubmitResponse> {
  const { data } = await api.post<ContactSubmitResponse>(API_CONFIG.ENDPOINTS.CONTACT, formValues)
  return data
}
