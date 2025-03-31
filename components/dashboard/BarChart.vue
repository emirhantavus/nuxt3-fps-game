<template>
      <div class="bg-gray-900 p-4 rounded-lg">
        <h3 class="text-white text-lg font-semibold mb-2">En Çok Satılan Ürünler</h3>
        <canvas ref="canvas"></canvas>
      </div>
    </template>
    
    <script setup lang="ts">
    import { ref, watch } from 'vue'
    import Chart from 'chart.js/auto'
    
    const props = defineProps<{ data: any }>()
    const canvas = ref<HTMLCanvasElement | null>(null)
    let chart: Chart | null = null
    
    watch(() => props.data, () => {
      if (props.data && canvas.value) {
        if (chart) chart.destroy()
        chart = new Chart(canvas.value, {
          type: 'bar',
          data: props.data,
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              }
            }
          }
        })
      }
    })
    </script>
    