import md5 from './utils/md5.js';
import { randomString } from './utils/index';

const secretKey = 'c8bed465c9e6a524';
const securityCode = '999999';

function setHeader(route: string, method: string, parma: object) {
  const t = Math.round(new Date().getTime() / 1000);
  const body =
    method === 'get' || method === 'delete' ? '' : JSON.stringify(parma);
  const random = randomString();
  const sign = md5.utf8MD5(route + t + securityCode + random + body);
  const header = {
    'content-type': 'application/json',
    'X-Bmob-SDK-Type': 'wechatApp',
    'X-Bmob-Safe-Sign': sign,
    'X-Bmob-Safe-Timestamp': t,
    'X-Bmob-Noncestr-Key': random,
    'X-Bmob-Secret-Key': secretKey,
  };
  return header;
}

const route = `/1/classes/_User`;
const ajax = new XMLHttpRequest();
ajax.open('GET', 'https://api2.bmob.cn/1/classes/_User', true);

const header = setHeader(route, 'get', {});

function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object;
}
Object.keys(header).forEach((key) => {
  if (isValidKey(key, header)) {
    const value = header[key];
    ajax.setRequestHeader(key, value + '');
  }
});
ajax.send();
ajax.onreadystatechange = function () {
  if (ajax.readyState == 4 && ajax.status == 200) {
    console.log(ajax.responseText);
  }
};