<!--  -->
<template>
  <div>{{num}}</div>
</template>

<script lang='ts' setup>
import { reactive,toRefs} from 'vue'
interface DataProps {num:number}
const state = reactive<DataProps>({ num: 3 })
const {num} =toRefs(state)
</script>
<style lang='scss' scoped>
</style>ue