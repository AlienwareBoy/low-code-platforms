<template>
  <el-upload
    ref="upload"
    v-model:file-list="fileList"
    :action="uploadConfig.action"
    :headers="uploadConfig.headers"
    :method="uploadConfig.method"
    :multiple="uploadConfig.multiple"
    :data="uploadConfig.data"
    :name="uploadConfig.name"
    :showFileList="uploadConfig.showFileList"
    :limit="uploadConfig.limit"
    :accept="uploadConfig.accept"
    :listType="uploadConfig.listType"
    :auto-upload="uploadConfig.autoUpload"
    :httpRequest="uploadConfig.httpRequest"
    :disabled="uploadConfig.disabled"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :on-success="handleSuccess"
    :on-exceed="handleExceed"
    :on-change="handleChange"
    class="upload-demo">
    <el-button type="primary">点击上传</el-button>
    <template #tip>
      <div class="el-upload__tip">
        {{ props.placeholder }}
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, toRefs, defineEmits, watch, onMounted, ref } from 'vue'
import { ElUpload, ElButton, genFileId } from 'element-plus'
import type {
  UploadFile,
  UploadFiles,
  UploadRequestOptions,
  UploadUserFile,
  UploadRawFile,
  UploadInstance,
} from 'element-plus'
import { fileUpload } from '@/apis/common'

interface DataProps {
  fileList: UploadFile[]
  uploadConfig: {
    limit: number // 允许上传文件的最大数量
    action?: string // 请求 URL
    headers?: Headers | Record<string, any> // 设置上传的请求头部
    method?: string // 设置上传请求方法
    multiple?: boolean // 是否支持多选文件
    data?: Record<string, string | Blob | [string | Blob, string]> // 上传时附带的额外参数
    name?: string // 上传的文件字段名
    withCredentials?: boolean // 支持发送 cookie 凭证信息
    showFileList?: boolean // 是否显示已上传文件列表
    accept?: string // 接受的文件类型
    fileList?: UploadUserFile[] // 上传的文件
    listType?: 'text' | 'picture' | 'picture-card' // 文件列表的类型
    autoUpload?: boolean // 是否自动上传文件
    httpRequest?: (options: UploadRequestOptions) => XMLHttpRequest | Promise<unknown> // 覆盖默认的 Xhr 行为，允许自行实现上传文件的请求
    disabled?: boolean // 是否禁用上传按钮
    needRawFile?: boolean // 是否需要源文件
  }
}
interface InputProps {
  disabled: boolean
  curIndex: number
  formKey: string
  modelForm: Record<any, any>
  defaultValue: string
  config: Record<any, any>
  placeholder?: string //导入说明
}

const props = withDefaults(defineProps<InputProps>(), {
  disabled: false,
  curIndex: 0,
  formKey: '',
  defaultValue: '',
  placeholder: '',
  config: () => ({}),
})
const upload = ref<UploadInstance>()
let state = reactive<DataProps>({
  fileList: [],
  uploadConfig: {
    action: '',
    method: 'post',
    multiple: true,
    data: {},
    withCredentials: false,
    showFileList: true,
    limit: 3,
    accept: '.xls,.xlsx,.word,.pdf,.jpg,.jpeg,.png,.doc,.docx,.txt,.gif,.bmp',
    fileList: [],
    listType: 'text',
    autoUpload: false,
    needRawFile: false,
  },
})
const emit = defineEmits<{
  (e: 'getValue', data: object): void
}>()
watch(
  () => state.fileList,
  async (cur, old) => {
    console.info('cur', cur)
  }
)
const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  console.log(file, fileList)
}
const handlePreview = (file: UploadFile) => {
  console.log(file)
}
const handleExceed = (files: File[], uploadFiles: UploadUserFile[]) => {
  if (state.uploadConfig.limit < files.length) {
    ElMessage.warning(`一次只能选择 ${state.uploadConfig.limit} 个文件，多选无效`)
  }
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
  state.fileList = uploadFiles as UploadFile[]
  getData(state.fileList.length, state.fileList)
}
const beforeRemove = (file: UploadFile, fileList: UploadFile[]) => {
  console.log(fileList, '-fileList-')
  return ElMessageBox.confirm(`请确认是否删除 ${file.name} ?`).then(
    () => {
      const arr = state.fileList.filter((it) => it.name !== file.name)
      emit('getValue', { value: arr, curIndex: props.curIndex, formKey: props.formKey })
    },
    () => false
  )
}
const handleSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  emit('getValue', { value: uploadFile.raw, curIndex: props.curIndex, formKey: props.formKey })
}
const handleUploadFile = async (rawFileLists: File[]) => {
  let formData = new FormData()
  formData.append('file', rawFileLists[0])
  const { errorCode, errorMsg, responseData } = await fileUpload(formData)
  if (+errorCode !== 0) return ElMessage.error(errorMsg)
  let fileName = rawFileLists[0].name.split('.')[0]
  emit('getValue', {
    value: { fileName, filePath: responseData.filePath },
    curIndex: props.curIndex,
    formKey: props.formKey,
  })
}
const handleChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  let fileExtension = '.' + uploadFile.name.split('.')[1]
  let acceptExtension = state.uploadConfig.accept?.split(',')
  state.fileList = acceptExtension?.includes(fileExtension)
    ? uploadFiles
    : uploadFiles.filter((item) => item.name !== uploadFile.name)
  const fileNum = state.fileList.length
  getData(fileNum, uploadFiles)
}
const getData = (fileNum: number, uploadFiles: UploadFiles) => {
  if (fileNum && fileNum <= state.uploadConfig.limit) {
    let rawFileLists = uploadFiles.map((item) => item.raw) as File[]
    if (state.uploadConfig.autoUpload) {
      // toto 调用传入的接口直接上传文件
    } else if (state.uploadConfig.needRawFile) {
      // 不需要存储到临时文件服务器, 返回源文件
      emit('getValue', { value: rawFileLists, curIndex: props.curIndex, formKey: props.formKey })
    } else {
      handleUploadFile(rawFileLists)
    }
  }
}
const init = () => {
  state.uploadConfig = Object.assign(state.uploadConfig, props.config)
}
onMounted(() => init())
let { fileList, uploadConfig } = toRefs(state)
</script>
<style lang="scss" scoped></style>
