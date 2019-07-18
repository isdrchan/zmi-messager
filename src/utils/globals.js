import md5 from 'js-md5'

const KEY = {
  get: 'get',
  post: 'post',
  gnCount: 'gnCount',
  remember: 'remember',
  password: 'password',
  realm: 'realm',
  nonce: 'nonce',
  qop: 'qop',
  ha1: 'ha1'
}
const VALUE = {
  protectedHa2: md5('GET:/cgi/protected.cgi'),
  actionGetHa2: md5('GET:/cgi/xml_action.cgi'),
  actionPostHa2: md5('POST:/cgi/xml_action.cgi')
}
const BASE_HEADER = {
  'Expires': '-1',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Pragma': 'no-cache'
}

export default {
  KEY,
  VALUE,
  BASE_HEADER
}
