import { getBaseURL } from './utils'

export default async (url = '', data = {}, type = 'GET', header = {}, body = '', method = 'fetch') => {
  type = type.toUpperCase()
  url = getBaseURL() + url

  if (type === 'GET') {
    let dataStr = ''
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&'
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
      url = url + '?' + dataStr
    }
  }

  if (window.fetch && method === 'fetch') {
    let requestConfig = {
      credentials: 'include',
      method: type,
      headers: {
        'Accept': 'application/xml, text/xml, */*; q=0.01',
        'Content-Type': 'application/xml'
      },
      mode: 'cors',
      cache: 'force-cache'
    }

    Object.keys(header).forEach(key => {
      requestConfig['headers'][key] = header[key]
    })

    if (type === 'POST' && body.length === 0) {
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      })
    } else if (type === 'POST') {
      requestConfig['body'] = body
    }

    try {
      const response = await fetch(url, requestConfig)
      return response
    } catch (error) {
      throw new Error(error)
    }
  } else {
    return new Promise((resolve, reject) => {
      let requestObj
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest()
      } else {
        /* eslint-disable */
        requestObj = new ActiveXObject
      }

      let sendData = ''
      if (type === 'POST') {
        sendData = JSON.stringify(data)
      }

      requestObj.open(type, url, true)
      requestObj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      Object.keys(header).forEach(key => {
        requestObj.setRequestHeader(key, header[key])
      })
      requestObj.send(sendData)

      requestObj.onreadystatechange = () => {
        if (requestObj.readyState === 4) {
          if (requestObj.status === 200) {
            // let obj = requestObj.response
            // if (typeof obj !== 'object') {
            //   obj = JSON.parse(obj)
            // }
            resolve(requestObj)
          } else {
            reject(requestObj)
          }
        }
      }
    })
  }
}
