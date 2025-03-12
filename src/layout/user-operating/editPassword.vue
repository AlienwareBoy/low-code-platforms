<!--  -->
<template>
  <CommonDiaLog
    :config="{
      width: '40%',
      title: '修改密码',
    }"
    v-model:model-value="isShow"
    @update:model-value="$emit('update:isShow', false)"
    @handlerComfirm="handlerComfirm"
    @handlerError="
      () => {
        $emit('update:isShowBox', false)
        $emit('onerror', true)
      }
    "
    @close="$emit('update:isShow', false)"
  >
    <template v-slot:content>
      <FilterConfig ref="FilterRefs" :config="editPasswordConfig" :rules="passwordRules" />
      <el-button size="small" type="danger" style="margin-top: 20px" @click="createRandomPassword">使用随机密码</el-button>
      <div class="passwordTips">
        <p>温馨提示：</p>
        <p>1.密码长度至少 10 位</p>
        <p>2.必须包含数字、大写字母、小写字母、特殊字符中的 3 种组合</p>
      </div>
    </template>
  </CommonDiaLog>
</template>

<script lang="ts" setup>
// import { resetPasswword } from '@/apis/user'
import { FilterConfigRefs, filterItem } from '@/components/filter-config/types'
// import { copyToClipboard } from '@/utils/utils'
import { FormRules } from 'element-plus'
const FilterRefs: Ref<FilterConfigRefs | null> = ref(null)
interface DataProps {
  editPasswordConfig: filterItem[]
  passwordRules: FormRules
  formData: Record<any, any>
}
const props = withDefaults(
  defineProps<{
    isShow: boolean
  }>(),
  {}
)
const emits = defineEmits<{
  (e: 'update:isShowBox', data: any): void
  (e: 'onsuccess', data: any): void
  (e: 'onerror', data: any): void
}>()
const checkisSome = (rule: any, value: any, callback: any) => {
  const regex = /^(?=.*\d)(?=.*[A-Za-z]).{10,20}$/
  if (value === '') {
    callback(new Error('请输入确认密码'))
  } else if (state.formData.newPassword !== state.formData.checkPassword) {
    callback(new Error('确保新密码和确认密码一致!'))
  }
  if (value.length < 10 || value.length > 20) {
    callback(new Error('密码长度在10-20位之间'))
  } else if (!regex.test(value)) {
    callback(new Error('请按照提示创建密码!'))
  } else {
    callback()
  }
}
const state = reactive<DataProps>({
  formData: {},
  passwordRules: {
    oldPassword: [{ required: true, trigger: 'change', message: '请输入原密码' }],
    newPassword: [{ required: true, trigger: 'change', message: '请填写新密码' }, { validator: checkisSome }],
    checkPassword: [{ required: true, trigger: 'change', message: '请输入确认密码' }, { validator: checkisSome }],
  },
  editPasswordConfig: [
    {
      label: '原密码',
      type: 'input',
      required: true,
      span: 24,
      labelWidth: 100,
      formKey: 'password',
    },
    {
      label: '新密码',
      type: 'input',
      span: 24,
      required: true,
      labelWidth: 100,
      formKey: 'newPassword',
    },
    {
      label: '确认新密码',
      type: 'input',
      span: 24,
      labelWidth: 100,
      required: true,
      formKey: 'confirmPassword',
    },
  ],
})
const createRandomPassword = () => {
  const result = createUtils()
  state.editPasswordConfig[1].defaultValue = result
  state.editPasswordConfig[2].defaultValue = result
}
const createUtils = () => {
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const digits = '0123456789'
  const specialCharacters = '!@#$%^&*()_+~`|}{[]\:;?><,./-='

  const getRandomCharacter = (characters: string) => characters[Math.floor(Math.random() * characters.length)]

  let password = getRandomCharacter(lowercaseLetters)
  password += getRandomCharacter(uppercaseLetters)
  password += getRandomCharacter(digits)
  password += getRandomCharacter(specialCharacters)

  const allCharacters = lowercaseLetters + uppercaseLetters + digits + specialCharacters
  password += Array.from({ length: 10 - password.length }, () => getRandomCharacter(allCharacters)).join('')

  return password
}
const handlerComfirm = async () => {
  let filterData = FilterRefs.value?.form as Record<any, any>
  console.info(filterData.modelForm, 'formData')
  state.formData = filterData.modelForm
  let result = await FilterRefs.value?.submitForm()
  if (result) {
    resetPasswword(state.formData).then((res) => {
      ElMessage.success(`密码已重置！新密码为:${res.responseData.password}密码已复制至您的电脑剪贴板，请妥善保管`)
			copyToClipboard(res.responseData.password)
      emits('update:isShowBox', false)
      emits('onsuccess', true)
    })
  }
}
const { isShow } = toRefs(props)
const { editPasswordConfig, passwordRules } = toRefs(state)
</script>
<style scoped>
.passwordTips {
  margin-top: 20px;
  p {
    margin-bottom: 10px;
  }
}
</style>
