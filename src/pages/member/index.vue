<!--  -->
<template>
 
</template>

<script setup>
import { reactive,toRefs} from 'vue'
const state = reactive({ num: 3 })
const {num} =toRefs(state)
</script>
<style>
</style>