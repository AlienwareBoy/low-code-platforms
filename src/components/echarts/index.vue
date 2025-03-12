<!--  -->
<template>
  <div>
    <div id="box" style="width: 100%; height: 400px"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, toRefs, watch } from 'vue'
import echartInstance from './echarts'
import { defaultConfig } from './consts'
import * as echarts from 'echarts'
interface DataProps {
  num: number
}
interface propsInterface {
  options?: echarts.EChartsOption
}
const props = withDefaults(defineProps<propsInterface>(), {
  options: () => defaultConfig,
})
watch(
  () => props.options,
  (cur: echarts.EChartsOption) => {
    if (cur) {
      init(cur)
    }
  }
)
const init = (options = props.options) => {
  const app = document.getElementById('box') as HTMLElement
  const myChart = echartInstance.init(app)
  myChart && myChart.setOption(options)
}
onMounted(() => {
  init()
  window.addEventListener('resize', () => init(props.options))
})
onUnmounted(() => {
  window.removeEventListener('resize', () => init(props.options))
})
const state = reactive<DataProps>({ num: 3 })
const { num } = toRefs(state)
</script>
<style scoped></style>
