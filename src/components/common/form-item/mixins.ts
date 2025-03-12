/**
 * formKey支持多种格式,name,或者是对象拼接 userInfo.name 如果一直有userInfo.name.sex，则一直以对象形式拼接
 * data 是传入当前model对象,
 * additionalData 则是拼接的对象
 * */
export const createRequestBody = (data: Record<any, any>, additionalData: Record<any, any>) => {
  const body = { ...data }

  const processFormKey = (obj: Record<any, any>, formKey: string, value: any) => {
    const keys = formKey.split('.')
    const key = keys.shift() as string

    if (keys.length === 0) {
      obj[key] = value
      return
    }

    if (!obj[key]) {
      obj[key] = {}
    }

    processFormKey(obj[key], keys.join('.'), value)
  }

  Object.entries(additionalData).forEach(([key, value]) => {
    processFormKey(body, key, value)
  })

  return body
}
