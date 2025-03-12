import { ElLoading, ElMessage } from 'element-plus'
// 防抖
export const debounce = (func: Function, delay: number | undefined) => {
  let timer: NodeJS.Timeout | undefined
  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
// 转换类型文案
export const conversionText = (text: any, list: any[] | object) => {
  let label = ''
  if (Array.isArray(list) && list.length > 0) {
    const arr = list.find((item: any) => item.value === text)
    if (isBlank(arr)) {
      console.error('转换失败：', text, list)
      return ''
    }
    return arr.label
  } else {
    if (typeof text === 'string' && text.length > 0) {
      let textArr = text.split(',')
      label = textArr
        .map((item: string) => {
          return (list as any)[item]
        })
        .join('、')
    }
    return label
  }
}
export function isBlank(obj: string | null | object | undefined) {
  if (undefined === obj || null === obj) {
    return true
  }
  if (typeof obj === 'string') {
    return obj.trim() === ''
  }
  if (Array.isArray(obj)) {
    return obj.length === 0
  }
}
type ThFn = (fn: ReFn, timer: number) => ReFn
type ReFn = (...args: any) => void

export const throttle: ThFn = (fn, timer) => {
  let time: any = null
  const _throttle = (...args: any) => {
    if (time) clearTimeout(time)
    time = setTimeout(() => {
      fn.apply(this, args)
    }, timer)
  }
  return _throttle
}
/**
 *
 * @param 时间戳
 * @returns
 */
export function timeFormatter(value: number) {
  if (value) {
    const d = new Date()
    d.setTime(value)
    return parseTime(d, '{y}-{m}-{d} {h}:{i}:{s}')
  }
  return ''
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time: string, cFormat?: string) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}
export function isNotBlank(obj: string | any[]) {
  return !isBlank(obj)
}
export const deepCopy = (obj: string | any[] | null) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  let copy

  if (Array.isArray(obj)) {
    copy = []

    for (let i = 0; i < obj.length; i++) {
      copy[i] = deepCopy(obj[i])
    }
  } else {
    copy = {}

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = deepCopy(obj[key])
      }
    }
  }

  return copy
}
// 手机号码脱敏
export const desensitizePhoneStr = (phone: string) => {
  return phone.replace(/^(.{3})(?:\d+)(.{4})$/, '$1****$2')
}

export function removeEmptyProperties(obj) {
  for (let key in obj) {
    if (obj[key] && typeof obj[key] === 'object') {
      removeEmptyProperties(obj[key])
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key]
      }
    } else if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      delete obj[key]
    }
  }
  return obj
}

//loading
export const loading = (text: string = '加载中') => {
  return ElLoading.service({
    text,
  })
}
/**
 *  文件导出功能
 *  @param {res} blod文件
 *  @config {config} 导出配置
*/
export const blobExport = (
  res: any,
  config?: {
    fileText: string
    ContentType: 'application/vnd.ms-excel' | 'application/binary'
		callback?:Function
  },
) => {
  const responseErrorType = ['application/json']
  const responseType = ['application/vnd.ms-excel', 'application/binary']

  if (responseErrorType.includes(res.type)) {
    let reader = new FileReader()
    reader.readAsText(res, 'utf-8')
    reader.onload = async (e) => {
      res.data = await JSON.parse(reader.result as string)
      !config!.callback && ElMessage.error(res.data.errorMsg)
			config!.callback && config!.callback(res.data)
    }
  } else if (responseType.includes(res.type)) {
    let blob = new Blob([res], { type: `${config?.ContentType};charset=UTF-8` })
    let url = URL.createObjectURL(blob)
    let a = document.createElement('a')
    a.download = `${(config && config.fileText) || '文件名'}.xlsx`
    a.href = url
    a.click()
    a.remove()
  }
}
