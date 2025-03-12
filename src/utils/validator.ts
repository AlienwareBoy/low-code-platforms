// 验证手机号码
// export const validatorPhone = (rule: any, value: any, callback: any) => {
//   if (/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)) {
//     callback(new Error('请输入正确的手机号码'))
//   } else if (!value) {
//     callback(new Error('请输入手机号码'))
//   } else {
//     callback()
//   }
// }

// 验证手机号码
export let validatePhone = (
  rule: any,
  value: string,
  callback: (arg0: Error | undefined) => void
) => {
  if (!value) {
    callback(new Error('电话号码格式不正确'))
    return
  }
  if (/^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[\d]{8}$/.test(value)) {
    callback(undefined)
    return
  } else {
    callback(new Error('电话号码格式不正确'))
  }
}

//验证前三位IP地址
export const validateTopThreeIP = (
  rule: any,
  value: string,
  callback: (arg0: Error | undefined) => void
) => {
  if (!value) {
    callback(new Error('请输入正确的IP'))
    return
  }else {
		const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
		if((!reg.test(value)) && value !== ''){
		callback(new Error('请输入正确的IP'))
		}else {
			callback(undefined)
		}
	}
}
//验证正确url
export const validateUrl = (rule:any,value:string,callback:(arg0: Error | undefined) => void)=>{
	if(!value || isHttps(value) || isHttp(value)){
		callback(undefined)
	}else {
		callback(new Error('请输入正确格式的url地址'))
		return
	}
}

/**
 * 判断是否正确Url
 * */
 export function isValidUrl(url: string): boolean {
  // 正则表达式用于验证URL的有效性
  var urlRegex = /^(http?|https?|ftp|wss?):\/\/[^\s/$.?#].[^\s]*$/
  return urlRegex.test(url)
}
/**
 *  判断是否Https
 * */
export function isHttps(url: string): boolean {
  if (isValidUrl(url)) {
    return url.startsWith('https://')
  }
  return false
}
/**
 *  判断是否Http
 * */
export function isHttp(url: string): boolean {
  if (isValidUrl(url)) {
    return url.startsWith('http://')
  }
  return false
}

/**
 *  判断是否是webSocket协议
 * */
 export function isWebSocket(url: string): boolean {
  if (isValidUrl(url)) {
    if (isHttps(url)) {
      return url.startsWith('wss://')
    } else {
      return url.startsWith('ws://')
    }
  }
  return false
}
