<script setup lang="ts">
// OpenLayers demo page with tree-shaken submodule imports.
// Uses Overlay class for custom HTML markers (not Vector layer).
// Coordinates converted via fromLonLat() from WGS84 [lng, lat] to EPSG:3857.
// Page is CSR-only (ssr: false), so static imports of ol submodules are safe.
import { onMounted, onUnmounted, ref, shallowRef } from 'vue'
import Map from 'ol/Map.js'
import View from 'ol/View.js'
import TileLayer from 'ol/layer/Tile.js'
import OSM from 'ol/source/OSM.js'
import Overlay from 'ol/Overlay.js'
import { fromLonLat } from 'ol/proj.js'
import { VERSION as olVersion } from 'ol/util.js'
import 'ol/ol.css'
import { useMarkerData } from '~/composables/useMarkerData'
import type { MarkerData } from '~/types/marker'

// SSR disabled — ol submodules access browser APIs on import
definePageMeta({ ssr: false })

// shallowRef for DOM ref and map instance (prevents deep Vue proxy traversal)
const mapContainer = shallowRef<HTMLElement | null>(null)
const mapInstance = shallowRef<Map | null>(null)
// ref for selected marker — Vue reactivity needed to trigger MarkerDialog
const selectedMarker = ref<MarkerData | null>(null)
const markers = useMarkerData()

onMounted(() => {
  const map = new Map({
    target: mapContainer.value!,
    layers: [
      new TileLayer({ source: new OSM() }),
    ],
    view: new View({
      center: fromLonLat([107.5777, 16.4698]),
      zoom: 14,
    }),
  })
  mapInstance.value = map

  // Create a custom HTML Overlay marker for each POI
  // NOTE: fromLonLat converts [lng, lat] WGS84 to EPSG:3857 Web Mercator
  for (const poi of markers) {
    const el = document.createElement('div')
    el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36"><path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z" fill="#2563eb"/><circle cx="12" cy="12" r="5" fill="white"/></svg>'
    el.style.cursor = 'pointer'
    el.addEventListener('click', () => {
      selectedMarker.value = poi
    })

    const overlay = new Overlay({
      element: el,
      position: fromLonLat([poi.lng, poi.lat]),
      positioning: 'bottom-center',
      stopEvent: false, // CRITICAL: allows click events to reach element's own listener
    })
    map.addOverlay(overlay)
  }
})

onUnmounted(() => {
  // Both steps required: setTarget(null) detaches DOM, dispose() releases all OL resources
  mapInstance.value?.setTarget(null)
  mapInstance.value?.dispose()
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
      <span class="text-sm font-semibold text-gray-900">OpenLayers Demo</span>
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
      <span class="text-xs font-semibold text-gray-700">OpenLayers</span>
      <span class="text-xs text-gray-400 ml-1">v{{ olVersion }}</span>
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
