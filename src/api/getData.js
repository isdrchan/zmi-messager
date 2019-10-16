import fetch from '@/utils/fetch'
import md5 from 'js-md5'
import GLOBALS from '@/utils/globals'
import { getStore, getAuthHeader, getSmsTime, isGSM7Code, encode } from '@/utils/utils'

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

export const sendSMS = (phone, content) => {
  const body = `<?xml version="1.0" encoding="US-ASCII"?> <RGW><message><flag><message_flag>SEND_SMS</message_flag><sms_cmd>4</sms_cmd></flag><send_save_message><contacts>${phone}</contacts><content>${encode(content)}</content><encode_type>${isGSM7Code(content) ? 'GSM7_default' : 'UNICODE'}</encode_type><sms_time>${getSmsTime()}</sms_time></send_save_message></message></RGW>`
  const header = {
    Authorization: getAuthHeader(GLOBALS.KEY.post),
    'X-Requested-With': 'XMLHttpRequest',
    Cookie: 'locale=cn; hard_ver=Ver.A; platform=mifi'
  }
  return fetch('/xml_action.cgi?method=set&module=duster&file=message', {}, 'POST', Object.assign({}, header, GLOBALS.BASE_HEADER), body)
}

export const delSMS = (id) => {
  const body = `<?xml version="1.0" encoding="US-ASCII"?> <RGW><message><flag><message_flag>DELETE_SMS</message_flag><sms_cmd>6</sms_cmd></flag><get_message><tags>12</tags><mem_store>1</mem_store></get_message><set_message><delete_message_id>${id + ','}</delete_message_id></set_message></message></RGW>`
  const header = {
    Authorization: getAuthHeader(GLOBALS.KEY.post),
    'X-Requested-With': 'XMLHttpRequest',
    Cookie: 'locale=cn; hard_ver=Ver.A; platform=mifi'
  }
  return fetch('/xml_action.cgi?method=set&module=duster&file=message', {}, 'POST', Object.assign({}, header, GLOBALS.BASE_HEADER), body)
}
