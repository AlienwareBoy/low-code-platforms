<template>
  <el-row v-if="list.length > 0">
    <el-col>
      <el-form
        ref="ruleFormRef"
        :model="modelForm"
        :rules="rules"
        label-position="left"
        label-width="30px">
        <el-row>
          <template v-for="(item, index) in list" :key="item.formKey">
            <template v-if="checkCondition(item.isShow || null)">
              <el-col :span="item.span" :offset="item.offset || 0">
                <el-form-item
                  :prop="item.formKey"
                  :required="item.required"
                  :label="item.label"
                  :show-message="isBlank(item.showMessage as any) || true"
                  :label-width="item.labelWidth || 'auto'"
                  :style="item.span === 24 ? 'margin-bottom:20px' : ''">
                  <component
                    :is="item.comp"
                    v-model:modelForm="modelForm"
                    v-bind="{
                      formKey: item.formKey,
                      defaultValue: item.defaultValue,
                      disabled: item.disabled || false,
                      config: item.config,
                      placeholder: item.placeholder,
                      curIndex: index,
                    }"
                    @getValue="getValue"></component>
                  <!--  -->
                </el-form-item>
              </el-col>
            </template>
          </template>
          <el-col :span="getBtnsBox">
            <div style="margin-left: 4px">
              <el-row :gutter="10" style="margin-top: 4px">
                <el-col
                  :pull="item.pull"
                  :push="item.push"
                  :span="item.span || 2"
                  :offset="index !== 0 ? item?.offset : 0"
                  v-for="(item, index) in btns"
                  :key="item.eventName">
                  <el-button type="primary" size="small" @click="checkForm(item, ruleFormRef)">{{
                    item.label
                  }}</el-button>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-col>
    <!-- <el-col>

    </el-col> -->
  </el-row>
</template>

<script setup lang="ts">
import { filterItem, btnsConfigItem, ItemValue, itemMap } from './types'
import { ElRow, ElCol, ElForm, ElFormItem, ElButton, tagEmits } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { FormRules } from 'element-plus'
import { debounce, isBlank, isNotBlank, removeEmptyProperties, throttle } from '@/utils/utils'
import { createRequestBody } from '../common/form-item/mixins'
import { cloneDeep } from 'lodash'

// 目前不支持从.ts文件引入interface
const ruleFormRef = ref<FormInstance>()
interface DataProps {
  list: filterItem[]
  modelForm: Record<any, any>
}
interface FilterConfigProps {
  config: filterItem[]
  btns?: btnsConfigItem[]
  rules?: FormRules
}
const emit = defineEmits<{
  (e: 'update:config', data: filterItem[]): void
  (
    e: 'getForm',
    data: {
      [formProps: string]: string | number | object
    }
  ): void
  (e: 'resetForm'): void
  (e: 'updateData', data: { [formProps: string]: string | number | object; curIndex: number }): void
  (
    e: string,
    data: {
      [formProps: string]: string | number | object
    }
  ): void
}>()
const props = withDefaults(defineProps<FilterConfigProps>(), {
  config: () => [],
  btns: () => [],
})
const getBtnsBox = computed(() => {
  let len = (state.list.map((item) => (item.span || 0) + (item.offset || 0)) as number[]).reduce(
    (a, b) => a + b
  )
  const residueNum = 24 - len
  return residueNum < 6 ? 12 : 23 - len
})

const checkCondition = (fn: (params: Record<any, any>) => boolean | null) => {
  if (!fn) return true
  if (typeof fn === 'function') {
    return fn(state.modelForm)
  }
}
// 获取表单数据
const getValue = (params: ItemValue) => {
  console.log('myParams', params)
  state.list[params.curIndex].defaultValue = params.value
  const body = createRequestBody(
    { formKey: params.formKey },
    { [`${params.formKey}`]: params.value }
  )
  emit('updateData', body)
}
const FilterConfig = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      emit('getForm', state.modelForm)
    } else {
      console.log('error submit!', fields)
    }
  })
}
const resetForm = () => {
  console.log(1)
  if (!ruleFormRef.value) return
  ruleFormRef.value?.resetFields()
  state.list = state.list.map((item) => {
    return {
      ...item,
      defaultValue: '',
    }
  })
}
const checkForm = debounce(function (item: btnsConfigItem, formEl: FormInstance | undefined) {
  console.log(item)
  if (item.eventName === 'validate') {
    throttle(() => FilterConfig(formEl), 1000)
  } else if (item.eventName === 'reset') {
    resetForm()
    emit('resetForm')
  } else if (item.eventName === 'search') {
    emit('getForm', state.modelForm)
  } else {
    console.log(item.eventName, 'eventName--')
    throttle(() => search(item.eventName), 1000)()
  }
}, 500)
const search = (eventName: string) => {
  console.log(state.modelForm, 'eventName')
  emit(`${eventName}`, state.modelForm)
}
let state = reactive<DataProps>({ list: [], modelForm: {} })
const submitForm = async () => {
  console.info(state.modelForm, 'state.modelForm')
  return new Promise((resolve, inject) => {
    ;(ruleFormRef.value as FormInstance).validate((valid, fields) => {
      if (valid) {
        let formCopy = cloneDeep(state.modelForm)
        let obj: Record<any, any> = removeEmptyProperties(formCopy)
        console.log(obj)
        resolve(obj)
      } else {
        console.log('error submit!', fields)
      }
    })
  })
}
const validateField = (itemProp: string, callback: Function) => {
  ;(ruleFormRef.value as FormInstance).validateField(itemProp, callback())
}
const reload = () => {
  const config = JSON.parse(JSON.stringify(props.config)).map((item) => {
    return {
      ...item,
      defaultValue: '',
    }
  })

  init(config)
}
watch(
  () => props.config,
  (cur, pre) => {
    if (cur && cur.length > 0) {
      init(cur)
    }
  },
  { deep: true }
)
const init = (config: filterItem[]) => {
  console.info(config, 'config')
  let body: Record<any, any> = {}
  for (let item of config) {
    if (!item.comp) {
      item.comp = itemMap.get(item.type)
    }
    if (
      item.type === 'time-select' &&
      item.config?.itemType === 'datetimerange' &&
      item.defaultValue
    ) {
      body = createRequestBody(body, {
        [`${item.formKey}TimeStart`]: item.defaultValue[0],
        [`${item.formKey}TimeEnd`]: item.defaultValue[1],
      })
    } else if (isNotBlank(item.defaultValue)) {
      console.info('我进来了')
      body = createRequestBody(body, {
        [`${item.formKey}`]: item.defaultValue,
      })
    } else {
      body = createRequestBody(body, {
        [`${item.formKey}`]: '',
      })
    }
  }
  state.list = config
  state.modelForm = body
  console.info(body, '初始化筛选参数')
  console.info(state.list, '初始化筛选器数组')
}
onMounted(() => {
  var list = toRaw(props.config)
  init(list)
})
defineExpose({
  init,
  form: state,
  resetForm,
  submitForm,
  reload,
  validateField,
})
let { btns, rules } = toRefs(props)
let { list, modelForm } = toRefs(state)
</script>
<style lang="scss" scoped>


:deep(.el-form-item) {
  margin-bottom: 0px;
}

</style>
