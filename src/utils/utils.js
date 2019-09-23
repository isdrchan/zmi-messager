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
  var arr = str.split('=')
  return arr[1].substring(1, arr[1].indexOf('"', 2))
}

export function hex (d) {
  var hD = '0123456789ABCDEF'
  var h = hD.substr(d & 15, 1)
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
  var obj = {}
  if (xml.nodeType === 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj['@attributes'] = {}
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j)
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue
      }
    }
  } else if (xml.nodeType === 3) { // text
    obj = xml.nodeValue
  }
  // do children
  if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i)
      var nodeName = item.nodeName
      if (typeof obj[nodeName] === 'undefined') {
        obj[nodeName] = xmlToJson(item)
      } else {
        if (typeof obj[nodeName].length === 'undefined') {
          var old = obj[nodeName]
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
  var deCodeStr = ''
  var strLen = encodeString.length / 4
  for (var idx = 0; idx < strLen; ++idx) {
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
  var code = ''
  for (var i = 0; i < string.length; ++i) {
    var charCode = string.charCodeAt(i).toString(16)
    var paddingLen = 4 - charCode.length
    for (var j = 0; j < paddingLen; ++j) {
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
  for (var i = 0; i < date.length - 1; i++) { // the last one is timezone , no need to handle
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
