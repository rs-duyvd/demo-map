<template>
  <div class="bg-white min-h-screen">
    <!-- Page header -->
    <div class="max-w-7xl mx-auto px-8 pt-12 pb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Map Library Comparison</h1>
      <p class="text-sm text-gray-500 mt-2">
        Evaluate five JavaScript map libraries on equal footing — same features, same data, fair comparison.
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

      <!-- Row 2: 2 centered cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 lg:max-w-[calc(66.666%+12px)] lg:mx-auto">
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
  },
  {
    name: 'MapLibre GL',
    description: 'Open-source WebGL map rendering engine forked from Mapbox GL JS, with vector tile support.',
    license: 'BSD-3-Clause',
    rendering: 'WebGL',
    bundle: '~240 kB',
    route: '/maplibre',
  },
  {
    name: 'Mapbox GL JS',
    description: 'GPU-accelerated vector map library with custom styles, 3D terrain, and rich data visualization.',
    license: 'Proprietary',
    rendering: 'WebGL',
    bundle: '~260 kB',
    route: '/mapbox',
  },
  {
    name: 'OpenLayers',
    description: 'Full-featured geo library supporting raster and vector layers, projections, and OGC standards.',
    license: 'BSD-2-Clause',
    rendering: 'Canvas/WebGL',
    bundle: '~950 kB',
    route: '/openlayers',
  },
  {
    name: 'HERE Maps',
    description: 'Enterprise mapping platform with traffic, routing, and geocoding via CDN-loaded JS SDK.',
    license: 'Proprietary',
    rendering: 'WebGL',
    bundle: 'CDN only',
    route: '/here',
  },
]

const row1Libraries = libraries.slice(0, 3)
const row2Libraries = libraries.slice(3)
</script>
