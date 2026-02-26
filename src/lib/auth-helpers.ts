import { AxiosError } from 'axios'

export function isTokenExpiredError(
  error: AxiosError<{ message?: string }>
): boolean {
  if (!error?.response) return false

  const status = error.response.status
  const message = error.response.data?.message

  if (status === 400 && message === 'key incorrect') return true
  if (status === 401) return true

  return false
}
