<script setup lang="ts">
import type { MarkerData } from '~/types/marker'

const props = defineProps<{
  marker: MarkerData | null
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="marker"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="emit('close')"
    >
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="marker"
          class="relative max-w-md w-full mx-4 rounded-lg overflow-hidden bg-white"
          role="dialog"
          aria-modal="true"
        >
          <!-- Close button -->
          <button
            class="absolute top-2 right-2 z-10 text-gray-400 hover:text-gray-700 text-xl leading-none p-1"
            aria-label="Close dialog"
            @click="emit('close')"
          >
            &#215;
          </button>

          <!-- Full-width image -->
          <img
            :src="marker.image"
            :alt="marker.name"
            class="w-full h-48 object-cover"
          />

          <!-- Content area -->
          <div class="p-4">
            <h2 class="text-lg font-semibold text-gray-900">
              {{ marker.name }}
            </h2>
            <p class="text-sm text-gray-500 mt-2">
              {{ marker.description }}
            </p>
            <a
              :href="marker.actionUrl"
              class="mt-4 block w-full text-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold py-2 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {{ marker.actionLabel }}
            </a>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
