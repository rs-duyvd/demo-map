<script setup lang="ts">
interface Props {
  /** URL to share (should be absolute for Facebook and OG consistency). */
  url: string
  /** Passed to the Web Share API as `title`. */
  title?: string
  /** Passed to the Web Share API as `text`. */
  text?: string
  /** Label for the Facebook action. */
  facebookLabel?: string
  /** Label when `navigator.share` is available (typically mobile). */
  shareLinkLabel?: string
  /** Label when Web Share is unavailable (desktop fallback is copy). */
  copyLinkLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  text: '',
  facebookLabel: 'Share on Facebook',
  shareLinkLabel: 'Share link',
  copyLinkLabel: 'Copy link',
})

const { openFacebookSharePopup, shareOrCopyLink } = useSocialShare()

const feedback = ref('')
const isBusy = ref(false)
const prefersWebShare = ref(false)

onMounted(() => {
  prefersWebShare.value = typeof navigator !== 'undefined'
    && typeof navigator.share === 'function'
})

const primaryLabel = computed(() =>
  prefersWebShare.value ? props.shareLinkLabel : props.copyLinkLabel,
)

async function handleFacebookShare() {
  feedback.value = ''
  const result = openFacebookSharePopup(props.url)
  if (!result.ok && result.reason === 'popup_blocked') {
    feedback.value = 'Popup was blocked. Allow popups for this site, or open Facebook and paste the link.'
  }
}

async function handleShareOrCopy() {
  feedback.value = ''
  isBusy.value = true
  try {
    const result = await shareOrCopyLink({
      url: props.url,
      title: props.title || undefined,
      text: props.text || undefined,
    })

    if (result.ok) {
      feedback.value = result.method === 'web_share'
        ? 'Shared successfully.'
        : 'Link copied to clipboard.'
      return
    }

    if (result.reason === 'aborted') {
      return
    }

    if (result.reason === 'not_allowed') {
      feedback.value = 'Sharing was blocked. You can copy the URL from the address bar.'
      return
    }

    if (result.reason === 'share_failed' || result.reason === 'clipboard_failed') {
      feedback.value = result.message
        ? `Could not share or copy: ${result.message}`
        : 'Could not share or copy the link. Try copying from the address bar.'
    }
  }
  finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50"
        :disabled="isBusy"
        @click="handleFacebookShare"
      >
        {{ facebookLabel }}
      </button>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50"
        :disabled="isBusy"
        @click="handleShareOrCopy"
      >
        {{ primaryLabel }}
      </button>
    </div>
    <p
      v-if="feedback"
      class="text-sm text-gray-600"
      role="status"
    >
      {{ feedback }}
    </p>
  </div>
</template>
