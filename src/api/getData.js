import fetch from '@/utils/fetch'
import md5 from 'js-md5'
import GLOBALS from '@/utils/globals'
import { getStore, getAuthHeader } from '@/utils/utils'

export const getAuth = () => fetch('/login.cgi', {}, 'GET', GLOBALS.BASE_HEADER)

export const doLogin = () => {
  const authCnonce = md5(Math.floor(Math.random() * 100001) + String(new Date().getTime())).substring(0, 16)
  const digestRes = md5(`${getStore(GLOBALS.KEY.ha1)}:${getStore(GLOBALS.KEY.nonce)}:00000001:${authCnonce}:${getStore(GLOBALS.KEY.qop)}:${GLOBALS.VALUE.protectedHa2}`)
  const params = {
    'realm': getStore(GLOBALS.KEY.realm),
    'nonce': getStore(GLOBALS.KEY.nonce),
    'response': digestRes,
    'qop': getStore(GLOBALS.KEY.qop),
    'cnonce': authCnonce,
    'Action': 'Digest',
    'username': 'admin',
    'temp': 'marvell'
  }
  const header = {
    Authorization: getAuthHeader(GLOBALS.KEY.get)
  }
  return fetch('/login.cgi', params, 'GET', Object.assign({}, header, GLOBALS.BASE_HEADER))
}

export const getDetails = () => {
  const params = {
    method: 'get',
    module: 'duster',
    file: 'status1'
  }
  const header = {
    Authorization: getAuthHeader(GLOBALS.KEY.get),
    'X-Requested-With': 'XMLHttpRequest',
    Cookie: 'locale=cn; hard_ver=Ver.A; platform=mifi'
  }
  return fetch('/xml_action.cgi', params, 'GET', Object.assign({}, header, GLOBALS.BASE_HEADER))
}

export const getSMS = (pageNum = 1) => {
  const body = `<?xml version="1.0" encoding="US-ASCII"?> <RGW><message><flag><message_flag>GET_RCV_SMS_LOCAL</message_flag></flag><get_message><page_number>${pageNum}</page_number></get_message></message></RGW>`
  const header = {
    Authorization: getAuthHeader(GLOBALS.KEY.post),
    'X-Requested-With': 'XMLHttpRequest',
    Cookie: 'locale=cn; hard_ver=Ver.A; platform=mifi'
  }
  return fetch('/xml_action.cgi?method=set&module=duster&file=message', {}, 'POST', Object.assign({}, header, GLOBALS.BASE_HEADER), body)
}
