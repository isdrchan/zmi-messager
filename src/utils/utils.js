import GLOBALS from '@/utils/globals'
import md5 from 'js-md5'

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}

/**
 * 移除localStorage
 */
export const removeStore = name => {
  if (!name) return
  return window.localStorage.removeItem(name)
}

/**
 * 获取根地址
 */
export function getBaseURL () {
  return `${location.protocol}//${location.host}`
}

/**
 * 取key=value串的value值
 * @param {*} str
 */
export function getValue (str) {
  let arr = str.split('=')
  return arr[1].substring(1, arr[1].indexOf('"', 2))
}

export function hex (d) {
  let hD = '0123456789ABCDEF'
  let h = hD.substr(d & 15, 1)
  while (d > 15) {
    d >>= 4
    h = hD.substr(d & 15, 1) + h
  }
  return h
}

/**
 * 获得带有验证信息的请求头值
 */
export function getAuthHeader (method) {
  let ha2
  if (method === 'get') {
    ha2 = GLOBALS.VALUE.actionGetHa2
  } else {
    ha2 = GLOBALS.VALUE.actionPostHa2
  }
  const authCnonce = md5(Math.floor(Math.random() * 100001) + String(new Date().getTime())).substring(0, 16)
  const authcountTmp = '0000000000' + hex(parseInt(getStore(GLOBALS.KEY.gnCount)))
  const authCount = authcountTmp.substring(authcountTmp.length - 8)
  const digestRes = md5(`${getStore(GLOBALS.KEY.ha1)}:${getStore(GLOBALS.KEY.nonce)}:${authCount}:${authCnonce}:${getStore(GLOBALS.KEY.qop)}:${ha2}`)
  setStore(GLOBALS.KEY.gnCount, parseInt(getStore(GLOBALS.KEY.gnCount)) + 1)
  const authHeader = `Digest username="admin", realm="${getStore(GLOBALS.KEY.realm)}", nonce="${getStore(GLOBALS.KEY.nonce)}", uri="/cgi/xml_action.cgi", response="${digestRes}", qop=${getStore(GLOBALS.KEY.qop)}, nc=${authCount}, cnonce="${authCnonce}"`
  return authHeader
}

// Changes XML to JSON
export function xmlToJson (xml) {
  // Create the return object
  let obj = {}
  if (xml.nodeType === 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj['@attributes'] = {}
      for (let j = 0; j < xml.attributes.length; j++) {
        let attribute = xml.attributes.item(j)
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue
      }
    }
  } else if (xml.nodeType === 3) { // text
    obj = xml.nodeValue
  }
  // do children
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      let item = xml.childNodes.item(i)
      let nodeName = item.nodeName
      if (typeof obj[nodeName] === 'undefined') {
        obj[nodeName] = xmlToJson(item)
      } else {
        if (typeof obj[nodeName].length === 'undefined') {
          let old = obj[nodeName]
          obj[nodeName] = []
          obj[nodeName].push(old)
        }
        obj[nodeName].push(xmlToJson(item))
      }
    }
  }
  return obj
}

export function formatObj (obj) {
  if (typeof obj !== 'object') {
    return obj
  }
  for (let k in obj) {
    console.log(k + ':' + obj[k])
    if (typeof obj[k] === 'object') {
      formatObj(obj[k])
    }
  }
}

/**
 * 短信decode
 */
export function decode (encodeString) {
  if (undefined === encodeString) {
    return ''
  }
  let deCodeStr = ''
  let strLen = encodeString.length / 4
  for (let idx = 0; idx < strLen; ++idx) {
    deCodeStr += String.fromCharCode(parseInt(encodeString.substr(idx * 4, 4), 16))
  }
  return deCodeStr
}

/**
 * 短信encode
 */
export function encode (string) {
  if (undefined === string) {
    return ''
  }
  let code = ''
  for (let i = 0; i < string.length; ++i) {
    let charCode = string.charCodeAt(i).toString(16)
    let paddingLen = 4 - charCode.length
    for (let j = 0; j < paddingLen; ++j) {
      charCode = '0' + charCode
    }
    code += charCode
  }
  return code
}

/**
 * 短信时间format
 */
export function formatTime (time) {
  let date = time.split(',')
  for (let i = 0; i < date.length - 1; i++) { // the last one is timezone , no need to handle
    if (date[i] < 10 && date[i].length < 2) { // add 0 if number is smaller than 10
      date[i] = '0' + date[i]
    }
  }
  return date[0] + '/' + date[1] + '/' + date[2] + ' ' + date[3] + ':' + date[4] + ':' + date[5] // month/day/year hh:mm:ss
}

/**
 * 判断是否为对象
 */
export function isObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isGSM7Code (str) {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    let chr = str.charCodeAt(i)
    if (((chr >= 0x20 && chr <= 0x7f) || chr === 0x20AC || chr === 0x20AC || chr === 0x0c || chr === 0x0a || chr === 0x0d || chr === 0xa1 || chr === 0xa3 || chr === 0xa5 || chr === 0xa7 || chr === 0xbf || chr === 0xc4 || chr === 0xc5 || chr === 0xc6 || chr === 0xc7 || chr === 0xc9 || chr === 0xd1 || chr === 0xd6 || chr === 0xd8 || chr === 0xdc || chr === 0xdf || chr === 0xe0 || chr === 0xe4 || chr === 0xe5 || chr === 0xe6 || chr === 0xe8 || chr === 0xe9 || chr === 0xec || chr === 0xf11 || chr === 0xf2 || chr === 0xf6 || chr === 0xf8 || chr === 0xf9 || chr === 0xfc || chr === 0x3c6 || chr === 0x3a9 || chr === 0x3a8 || chr === 0x3a3 || chr === 0x3a0 || chr === 0x39e || chr === 0x39b || chr === 0x398 || chr === 0x394 || chr === 0x393) && chr !== 0x60) {
      ++len
    }
  }
  return len === str.length
}

export function getSmsTime () {
  let date = new Date()
  let fullYear = String(date.getFullYear())
  let year = fullYear.substr(2, fullYear.length - 1)
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let mimute = date.getMinutes()
  let second = date.getSeconds()
  let timeZone = 0 - date.getTimezoneOffset() / 60
  let timeZoneStr = ''
  if (timeZone > 0) {
    timeZoneStr = '%2B' + timeZone
  } else {
    timeZoneStr = '-' + timeZone
  }
  let smsTime = year + ',' + month + ',' + day + ',' + hour + ',' + mimute + ',' + second + ',' + timeZoneStr
  return smsTime
}
