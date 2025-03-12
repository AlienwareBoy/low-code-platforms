import { Component, markRaw } from 'vue'
import editPassword from './editPassword.vue'
import editInfo from './editInfo.vue'
export type CompTypeInterface = 'editInfo' | 'editPassword' | null

export const Comp = new Map<CompTypeInterface, Component>([
  ['editInfo', markRaw(editInfo)],
  ['editPassword', markRaw(editPassword)],
])
