<!--  -->
<template>
  <div>{{num}}</div>
</template>

<script lang='ts' setup>
import { reactive,toRefs} from 'vue'
const state = reactive<DataProps>({ num: 23 })
const {num} =toRefs(state)
</script>
<style lang='scss' scoped>
</style>