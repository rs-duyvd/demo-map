<template>
  <div class="bg-white min-h-screen">
    <!-- Page header -->
    <div class="max-w-7xl mx-auto px-8 pt-12 pb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Map Library Comparison</h1>
      <p class="text-sm text-gray-500 mt-2">
        Evaluate four JavaScript map libraries on equal footing — same features, same data, fair comparison.
      </p>
    </div>

    <!-- Card grid -->
    <div class="max-w-7xl mx-auto px-8 pb-12">
      <!-- Row 1: 3 cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="lib in row1Libraries"
          :key="lib.route"
          class="bg-gray-100 border border-gray-200 rounded-lg transition-shadow duration-150 hover:shadow-md overflow-hidden"
        >
          <!-- Preview image placeholder -->
          <div class="w-full h-[180px] bg-gray-200 flex items-center justify-center" aria-hidden="true">
            <span class="text-sm text-gray-400">{{ lib.name }}</span>
          </div>
          <!-- Card body -->
          <div class="p-4">
            <h2 class="text-lg font-semibold text-gray-900">{{ lib.name }}</h2>
            <p class="text-sm text-gray-500 mt-2">{{ lib.description }}</p>
            <!-- Tech specs row -->
            <div class="mt-2 flex items-center gap-2 text-xs">
              <span>
                <span class="text-gray-400">License</span>
                <span class="text-gray-600 ml-1">{{ lib.license }}</span>
              </span>
              <span class="text-gray-300">&middot;</span>
              <span>
                <span class="text-gray-400">Rendering</span>
                <span class="text-gray-600 ml-1">{{ lib.rendering }}</span>
              </span>
              <span class="text-gray-300">&middot;</span>
              <span>
                <span class="text-gray-400">Bundle</span>
                <span class="text-gray-600 ml-1">{{ lib.bundle }}</span>
              </span>
            </div>
            <!-- Token & pricing row -->
            <div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span
                v-if="lib.apiKey"
                class="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 font-medium"
              >
                🔑 API token required
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5 font-medium"
              >
                ✓ No API key required
              </span>
              <span class="text-gray-400">{{ lib.pricing }}</span>
            </div>
            <!-- View Demo link -->
            <NuxtLink
              :to="lib.route"
              class="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline focus:outline-2 focus:outline-blue-600 focus:outline-offset-2"
            >
              View Demo
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Row 2: 1 centered card -->
      <div class="grid grid-cols-1 gap-6 mt-6 lg:max-w-[calc(33.333%-8px)] lg:mx-auto">
        <div
          v-for="lib in row2Libraries"
          :key="lib.route"
          class="bg-gray-100 border border-gray-200 rounded-lg transition-shadow duration-150 hover:shadow-md overflow-hidden"
        >
          <!-- Preview image placeholder -->
          <div class="w-full h-[180px] bg-gray-200 flex items-center justify-center" aria-hidden="true">
            <span class="text-sm text-gray-400">{{ lib.name }}</span>
          </div>
          <!-- Card body -->
          <div class="p-4">
            <h2 class="text-lg font-semibold text-gray-900">{{ lib.name }}</h2>
            <p class="text-sm text-gray-500 mt-2">{{ lib.description }}</p>
            <!-- Tech specs row -->
            <div class="mt-2 flex items-center gap-2 text-xs">
              <span>
                <span class="text-gray-400">License</span>
                <span class="text-gray-600 ml-1">{{ lib.license }}</span>
              </span>
              <span class="text-gray-300">&middot;</span>
              <span>
                <span class="text-gray-400">Rendering</span>
                <span class="text-gray-600 ml-1">{{ lib.rendering }}</span>
              </span>
              <span class="text-gray-300">&middot;</span>
              <span>
                <span class="text-gray-400">Bundle</span>
                <span class="text-gray-600 ml-1">{{ lib.bundle }}</span>
              </span>
            </div>
            <!-- Token & pricing row -->
            <div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span
                v-if="lib.apiKey"
                class="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 font-medium"
              >
                🔑 API token required
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5 font-medium"
              >
                ✓ No API key required
              </span>
              <span class="text-gray-400">{{ lib.pricing }}</span>
            </div>
            <!-- View Demo link -->
            <NuxtLink
              :to="lib.route"
              class="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline focus:outline-2 focus:outline-blue-600 focus:outline-offset-2"
            >
              View Demo
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const libraries = [
  {
    name: 'Leaflet',
    description: 'Lightweight, mobile-friendly interactive maps with a simple API and extensive plugin ecosystem.',
    license: 'BSD-2-Clause',
    rendering: 'Raster tiles',
    bundle: '~42 kB',
    route: '/leaflet',
    apiKey: false,
    pricing: 'Free · OpenStreetMap tiles',
  },
  {
    name: 'MapLibre GL',
    description: 'Open-source WebGL map rendering engine forked from Mapbox GL JS, with vector tile support.',
    license: 'BSD-3-Clause',
    rendering: 'WebGL',
    bundle: '~240 kB',
    route: '/maplibre',
    apiKey: false,
    pricing: 'Free · OpenFreeMap tiles',
  },
  {
    name: 'Mapbox GL JS',
    description: 'GPU-accelerated vector map library with custom styles, 3D terrain, and rich data visualization.',
    license: 'Proprietary',
    rendering: 'WebGL',
    bundle: '~260 kB',
    route: '/mapbox',
    apiKey: true,
    pricing: 'Free tier: 50k map loads/month · then $5 / 1,000',
  },
  {
    name: 'OpenLayers',
    description: 'Full-featured geo library supporting raster and vector layers, projections, and OGC standards.',
    license: 'BSD-2-Clause',
    rendering: 'Canvas/WebGL',
    bundle: '~950 kB',
    route: '/openlayers',
    apiKey: false,
    pricing: 'Free · OpenStreetMap tiles',
  },
]

const row1Libraries = libraries.slice(0, 3)
const row2Libraries = libraries.slice(3)
</script>
