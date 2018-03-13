/**
 * Created by ale on 2016/12/22.
 */

function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}
//在js引擎内部,decodeURIComponent(str)相当于escape(unicodeToUTF8(str));