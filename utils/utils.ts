import { redirect } from "@/i18n/navigation";
import { useLocale } from "next-intl";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
): never {
  const locale = useLocale();
  return redirect({
    href:`${path}?${type}=${encodeURIComponent(message)}`,
    locale:locale,
  });
}
