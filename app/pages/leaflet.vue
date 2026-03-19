<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from 'vue'
import { useMarkerData } from '~/composables/useMarkerData'
import type { MarkerData } from '~/types/marker'

definePageMeta({ ssr: false })

const mapContainer = ref<HTMLElement | null>(null)
const mapInstance = shallowRef<import('leaflet').Map | null>(null)
const selectedMarker = ref<MarkerData | null>(null)
const leafletVersion = ref('')
const markers = useMarkerData()

onMounted(async () => {
  const leafletModule = await import('leaflet')
  const L = leafletModule.default
  leafletVersion.value = leafletModule.version

  mapInstance.value = L.map(mapContainer.value!, {
    center: [16.4698, 107.5777],
    zoom: 14,
    zoomControl: true,
  })

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(mapInstance.value)

  for (const poi of markers) {
    const icon = L.divIcon({
      html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36"><path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z" fill="#2563eb"/><circle cx="12" cy="12" r="5" fill="white"/></svg>',
      className: '',
      iconSize: [24, 36],
      iconAnchor: [12, 36],
    })

    const leafletMarker = L.marker([poi.lat, poi.lng], { icon }).addTo(mapInstance.value!)
    leafletMarker.getElement()?.addEventListener('click', () => {
      selectedMarker.value = poi
    })
  }
})

onUnmounted(() => {
  mapInstance.value?.remove()
  mapInstance.value = null
})
</script>

<template>
  <!-- Page header -->
  <div class="h-16 bg-white border-b border-gray-200 flex items-center px-8">
    <NuxtLink
      to="/"
      class="text-sm text-gray-500 hover:text-gray-900"
    >
      ← Home
    </NuxtLink>
    <div class="flex-1 text-center">
      <span class="text-sm font-semibold text-gray-900">Leaflet Demo</span>
    </div>
    <div class="w-16" />
  </div>

  <!-- Info bar -->
  <div class="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-8 gap-3 text-xs">
    <span class="inline-flex items-center gap-1 text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5 font-medium">
      ✓ No API key required
    </span>
    <span class="inline-flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-0.5 font-medium">
      Free &amp; open source (BSD-2)
    </span>
    <span class="text-gray-400">Tiles: OpenStreetMap (free)</span>
  </div>

  <!-- Map container wrapper -->
  <div class="relative">
    <!-- Version badge -->
    <div class="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
      <span class="text-xs font-semibold text-gray-700">Leaflet</span>
      <span class="text-xs text-gray-400 ml-1">v{{ leafletVersion }}</span>
    </div>

    <!-- Map div — explicit height prevents 0px collapse -->
    <div
      ref="mapContainer"
      class="w-full h-[calc(100vh-104px)]"
    />
  </div>

  <!-- MarkerDialog -->
  <MarkerDialog
    :marker="selectedMarker"
    @close="selectedMarker = null"
  />
</template>
