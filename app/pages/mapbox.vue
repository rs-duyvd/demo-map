<script setup lang="ts">
// Mapbox GL JS demo page with access token from runtimeConfig.
// Uses shallowRef for mapInstance to prevent Vue from traversing the WebGL object graph.
// Page is CSR-only (ssr: false), so static imports of mapbox-gl and its CSS are safe.
import { onMounted, onUnmounted, ref, shallowRef } from 'vue'
import mapboxgl, { Map, Marker, NavigationControl } from 'mapbox-gl'
import { version as mapboxVersion } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMarkerData } from '~/composables/useMarkerData'
import type { MarkerData } from '~/types/marker'

// SSR disabled — Mapbox GL accesses window/WebGL on import
definePageMeta({ ssr: false })

const config = useRuntimeConfig()

// shallowRef for DOM ref and map instance (prevents deep Vue proxy traversal)
const mapContainer = shallowRef<HTMLElement | null>(null)
const mapInstance = shallowRef<Map | null>(null)
// ref for selected marker — Vue reactivity needed to trigger MarkerDialog
const selectedMarker = ref<MarkerData | null>(null)
const markers = useMarkerData()

onMounted(() => {
  // Set access token BEFORE creating the Map instance
  mapboxgl.accessToken = config.public.mapboxToken as string

  mapInstance.value = new Map({
    container: mapContainer.value!,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [107.5777, 16.4698], // [lng, lat] — Hue Imperial Citadel
    zoom: 14,
  })

  // Navigation control (compass + zoom buttons) in top-right
  mapInstance.value.addControl(new NavigationControl(), 'top-right')

  // Create a custom HTML marker element for each POI
  // NOTE: Mapbox GL uses [lng, lat] order — same as MapLibre
  for (const poi of markers) {
    const el = document.createElement('div')
    el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36"><path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z" fill="#2563eb"/><circle cx="12" cy="12" r="5" fill="white"/></svg>'
    el.style.cursor = 'pointer'
    el.addEventListener('click', () => {
      selectedMarker.value = poi
    })
    new Marker({ element: el }).setLngLat([poi.lng, poi.lat]).addTo(mapInstance.value!)
  }
})

onUnmounted(() => {
  // Destroy WebGL context and detach all event listeners to prevent memory leaks
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
      <span class="text-sm font-semibold text-gray-900">Mapbox GL JS Demo</span>
    </div>
    <div class="w-16" />
  </div>

  <!-- Map container wrapper -->
  <div class="relative">
    <!-- Version badge -->
    <div class="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
      <span class="text-xs font-semibold text-gray-700">Mapbox GL JS</span>
      <span class="text-xs text-gray-400 ml-1">v{{ mapboxVersion }}</span>
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
