const FACEBOOK_SHARER = 'https://www.facebook.com/sharer/sharer.php'

export type FacebookShareResult =
  | { ok: true }
  | { ok: false; reason: 'popup_blocked' }

export type ShareOrCopyResult =
  | { ok: true; method: 'web_share' }
  | { ok: true; method: 'clipboard' }
  | { ok: false; reason: 'aborted' }
  | { ok: false; reason: 'not_allowed'; message?: string }
  | { ok: false; reason: 'share_failed'; message?: string }
  | { ok: false; reason: 'clipboard_failed'; message?: string }

export interface ShareLinkOptions {
  url: string
  title?: string
  text?: string
}

function isClient(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export interface FacebookShareOptions {
  /** Optional pre-filled text in the share composer (support varies by Facebook surface). */
  quote?: string
}

/**
 * Opens the Facebook sharer in a popup. If the browser blocks the popup, returns `popup_blocked`.
 * Link previews are taken from Open Graph tags at `url` — pass a URL whose server renders matching og:* tags (e.g. this page with `?t=&d=&i=` query params).
 */
export function openFacebookSharePopup(
  url: string,
  options?: FacebookShareOptions,
): FacebookShareResult {
  if (!isClient())
    return { ok: false, reason: 'popup_blocked' }

  let sharerUrl = `${FACEBOOK_SHARER}?u=${encodeURIComponent(url)}`
  if (options?.quote?.trim())
    sharerUrl += `&quote=${encodeURIComponent(options.quote.trim())}`
  const popup = window.open(
    sharerUrl,
    'facebook-share',
    'width=580,height=400,noopener,noreferrer',
  )
  if (!popup || popup.closed)
    return { ok: false, reason: 'popup_blocked' }

  try {
    popup.focus()
  }
  catch {
    /* ignore */
  }
  return { ok: true }
}

function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError')
    return true
  return error instanceof Error && error.name === 'AbortError'
}

function isNotAllowedError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'NotAllowedError')
    return true
  return error instanceof Error && error.name === 'NotAllowedError'
}

/**
 * Writes text to the clipboard, with a fallback for older browsers or denied Clipboard API.
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (!isClient())
    throw new Error('copyToClipboard is only available in the browser')

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(textarea)
  if (!ok)
    throw new Error('execCommand copy failed')
}

/**
 * Uses Web Share API when available; otherwise copies the URL to the clipboard.
 * Handles AbortError (user dismissed sheet) and permission errors without throwing.
 */
export async function shareOrCopyLink(options: ShareLinkOptions): Promise<ShareOrCopyResult> {
  const { url, title, text } = options

  if (!isClient())
    return { ok: false, reason: 'clipboard_failed', message: 'Not in browser context' }

  const canShare = typeof navigator !== 'undefined'
    && typeof navigator.share === 'function'

  if (canShare) {
    const shareData: ShareData = {
      title: title ?? '',
      text: text ?? '',
      url,
    }
    if (typeof navigator.canShare === 'function' && !navigator.canShare(shareData)) {
      try {
        await copyToClipboard(url)
        return { ok: true, method: 'clipboard' }
      }
      catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        return { ok: false, reason: 'clipboard_failed', message }
      }
    }

    try {
      await navigator.share(shareData)
      return { ok: true, method: 'web_share' }
    }
    catch (error) {
      if (isAbortError(error))
        return { ok: false, reason: 'aborted' }

      if (isNotAllowedError(error)) {
        return {
          ok: false,
          reason: 'not_allowed',
          message: error.message,
        }
      }

      // Invalid data or other share errors — try clipboard
      try {
        await copyToClipboard(url)
        return { ok: true, method: 'clipboard' }
      }
      catch (clipboardErr) {
        const msg = clipboardErr instanceof Error ? clipboardErr.message : String(clipboardErr)
        return {
          ok: false,
          reason: 'share_failed',
          message: error instanceof Error ? error.message : msg,
        }
      }
    }
  }

  try {
    await copyToClipboard(url)
    return { ok: true, method: 'clipboard' }
  }
  catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { ok: false, reason: 'clipboard_failed', message }
  }
}

/**
 * Builds an absolute URL for Open Graph and canonical links from `runtimeConfig.public.siteUrl`.
 */
export function buildAbsoluteUrl(siteUrl: string, pathOrUrl: string): string {
  const trimmed = siteUrl.replace(/\/$/, '')
  if (/^https?:\/\//i.test(pathOrUrl))
    return pathOrUrl
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${trimmed}${path}`
}

export function useSocialShare() {
  return {
    openFacebookSharePopup,
    shareOrCopyLink,
    copyToClipboard,
    buildAbsoluteUrl,
  }
}
