<script setup lang="ts">
/**
 * Open Graph testing (Facebook Sharing Debugger)
 *
 * Facebook and Instagram crawlers fetch your page’s HTML and read og:* meta tags. They typically
 * cannot reach http://localhost — use a deployed URL or a tunnel (ngrok, Cloudflare Tunnel) for
 * debugger testing.
 *
 * Steps:
 * 1. Open https://developers.facebook.com/tools/debug/
 * 2. Enter the public HTTPS URL of this page and run “Debug”.
 * 3. Confirm og:title, og:description, og:image, and og:url in the output.
 * 4. After changing metadata, use “Scrape Again” to refresh Facebook’s cache.
 *
 * Local verification: run `pnpm dev`, view page source (View Source, not DevTools Elements) and
 * confirm meta tags are present in the initial HTML. Instagram uses similar link-preview scraping;
 * there is no separate Instagram debugger comparable to Facebook’s tool.
 */

interface ShareExampleArticle {
  title: string
  description: string
  /** Longer body shown on the page; included in Web Share text (with description). */
  content: string
  /** Absolute https URL or site-relative path for og:image */
  image: string
}

const { buildAbsoluteUrl } = useSocialShare()
const config = useRuntimeConfig()
const route = useRoute()

const siteUrl = computed(() => String(config.public.siteUrl).replace(/\/$/, ''))

const { data: article } = await useAsyncData('share-example-article', async () => {
  await new Promise<void>(resolve => setTimeout(resolve, 150))
  const result: ShareExampleArticle = {
    title: 'Social share demo: dynamic Open Graph metadata',
    description:
      'This page loads article data with useAsyncData and sets SSR-friendly og:* tags via useSeoMeta so crawlers see title, description, and image.',
    content:
      'You can edit the fields below to change what appears on this page, in Open Graph meta tags (after hydration), and what is sent to the Web Share API. The canonical page URL is the default share link; override it to test sharing another destination.',
    image: 'https://placehold.co/1200x630/2563eb/ffffff?text=Open+Graph+Preview',
  }
  return result
})

const canonicalUrl = computed(() =>
  buildAbsoluteUrl(siteUrl.value, route.fullPath.split('#')[0] ?? route.path),
)

/** User-editable preview: synced from fetched article, then local edits apply. */
const form = reactive({
  title: '',
  description: '',
  content: '',
  image: '',
  /** Share link (defaults to this page’s canonical URL). */
  shareUrl: '',
})

watch(
  article,
  (a) => {
    if (!a)
      return
    form.title = a.title
    form.description = a.description
    form.content = a.content
    form.image = a.image
    if (!form.shareUrl.trim())
      form.shareUrl = canonicalUrl.value
  },
  { immediate: true },
)

watch(canonicalUrl, (url) => {
  if (!form.shareUrl.trim())
    form.shareUrl = url
})

const shareUrlEffective = computed(() => {
  const raw = form.shareUrl.trim()
  return raw || canonicalUrl.value
})

const ogImageUrl = computed(() => {
  const raw = form.image.trim() || String(config.public.ogImageDefault ?? '')
  if (!raw)
    return ''
  return buildAbsoluteUrl(siteUrl.value, raw)
})

const seoTitle = computed(() => form.title.trim() || 'Social share example')
const seoDescription = computed(
  () =>
    form.description.trim()
    || 'Example page for Facebook sharing and Open Graph metadata in Nuxt.',
)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: ogImageUrl,
  ogUrl: canonicalUrl,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: ogImageUrl,
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
})

/** Combined text for Web Share (description + body), length-limited. */
const shareBodyText = computed(() => {
  const parts = [form.description.trim(), form.content.trim()].filter(Boolean)
  return parts.join('\n\n').slice(0, 8000)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-3xl px-6 py-10">
      <h1 class="text-2xl font-semibold text-gray-900">
        Share preview &amp; Open Graph
      </h1>
      <p class="mt-2 text-sm text-gray-600">
        Adjust title, text, image URL, and the link used when sharing. Meta tags update from these
        values in the browser; crawlers still see the server-rendered HTML from the initial load
        unless you rebuild or use SSR with the same values.
      </p>

      <!-- Editable share payload -->
      <section class="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Edit content &amp; share data
        </h2>
        <div class="mt-4 space-y-4">
          <div>
            <label
              for="share-title"
              class="mb-1 block text-sm font-medium text-gray-700"
            >Title</label>
            <input
              id="share-title"
              v-model="form.title"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autocomplete="off"
            >
          </div>
          <div>
            <label
              for="share-description"
              class="mb-1 block text-sm font-medium text-gray-700"
            >Description (OG + share text)</label>
            <textarea
              id="share-description"
              v-model="form.description"
              rows="3"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              for="share-content"
              class="mb-1 block text-sm font-medium text-gray-700"
            >Content (page body; appended to share text)</label>
            <textarea
              id="share-content"
              v-model="form.content"
              rows="5"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              for="share-image"
              class="mb-1 block text-sm font-medium text-gray-700"
            >Image URL (Open Graph preview)</label>
            <input
              id="share-image"
              v-model="form.image"
              type="url"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="https://…"
              autocomplete="off"
            >
          </div>
          <div>
            <label
              for="share-link"
              class="mb-1 block text-sm font-medium text-gray-700"
            >Link to share</label>
            <input
              id="share-link"
              v-model="form.shareUrl"
              type="url"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              :placeholder="canonicalUrl"
              autocomplete="off"
            >
            <p class="mt-1 text-xs text-gray-500">
              Leave empty to use the canonical URL below.
            </p>
          </div>
        </div>
      </section>

      <!-- Live preview -->
      <section class="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 class="text-lg font-medium text-gray-900">
          {{ form.title || '—' }}
        </h2>
        <p class="mt-3 text-gray-600">
          {{ form.description || '—' }}
        </p>
        <div
          v-if="form.image.trim()"
          class="mt-6 overflow-hidden rounded-lg border border-gray-100 bg-gray-50"
        >
          <img
            :src="form.image.trim()"
            alt=""
            class="h-auto max-h-80 w-full object-cover"
            width="1200"
            height="630"
          >
        </div>
        <div class="prose prose-sm mt-6 max-w-none text-gray-700">
          <p class="whitespace-pre-wrap">
            {{ form.content || '—' }}
          </p>
        </div>
      </section>

      <!-- Actions -->
      <section class="mt-8 space-y-3">
        <h2 class="text-lg font-medium text-gray-900">
          Share
        </h2>
        <p class="text-sm text-gray-500">
          Facebook opens the sharer in a popup. Web Share / copy uses the link and text fields above.
        </p>
        <SocialShare
          :url="shareUrlEffective"
          :title="form.title"
          :text="shareBodyText"
        />
      </section>

      <p class="mt-10 text-xs text-gray-400">
        Canonical URL (og:url):
        <span class="break-all text-gray-500">{{ canonicalUrl }}</span>
      </p>
    </div>
  </div>
</template>
