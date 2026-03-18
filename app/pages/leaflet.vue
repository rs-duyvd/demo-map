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
    center: [16.0, 107.0],
    zoom: 6,
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

    L.marker([poi.lat, poi.lng], { icon })
      .on('click', () => {
        selectedMarker.value = poi
      })
      .addTo(mapInstance.value!)
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
      class="w-full h-[calc(100vh-64px)]"
    />
  </div>

  <!-- MarkerDialog -->
  <MarkerDialog
    :marker="selectedMarker"
    @close="selectedMarker = null"
  />
</template>
