import {
  SystemConfig
} from '../config';
import Decimal from 'decimal';

// 截取字符串，多余的部分用...代替
export let setString = (str, len) => {
  let StrLen = 0;
  let s = '';
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 128) {
      StrLen += 2;
    } else {
      StrLen++;
    }
    s += str.charAt(i);
    if (StrLen >= len) {
      return s + '...';
    }
  }
  return s;
};

// 格式化设置
export let OptionFormat = (GetOptions) => {
  let options = '{';
  for (let n = 0; n < GetOptions.length; n++) {
    options = options + '\'' + GetOptions[n].option_name + '\':\'' + GetOptions[n].option_value + '\'';
    if (n < GetOptions.length - 1) {
      options = options + ',';
    }
  }
  return JSON.parse(options + '}');
};

// 替换SQL字符串中的前缀
export let SqlFormat = (str) => {
  if (SystemConfig.mysql_prefix !== 'api_') {
    str = str.replace(/api_/g, SystemConfig.mysql_prefix);
  }
  return str;
};

// 数组去重
export let HovercUnique = (arr) => {
  let n = {};
  let r = [];
  for (var i = 0; i < arr.length; i++) {
    if (!n[arr[i]]) {
      n[arr[i]] = true;
      r.push(arr[i]);
    }
  }
  return r;
};

// 获取json长度
export let getJsonLength = (jsonData) => {
  var arr = [];
  for (var item in jsonData) {
    arr.push(jsonData[item]);
  }
  return arr.length;
};

export let addRouters = (router, controller, routers = []) => {
  for (let r of routers) {
    let apis = getApis(controller, r);
    for (let api of apis) {
      router[api[0]](api[1], api[2]);
    }
  }
};

let getApis = (controller, r) => {
  let _r = r.split('.');
  let returnValue = controller;
  for (let key of _r) {
    returnValue = returnValue[key];
  }
  return returnValue.apis;
};

let message = (_massge, code, data) => {
  return {
    message: _massge,
    code,
    data: toArray(data),
  };
};

let toArray = (array) => {
  if (toString.call(array) === '[object Array]') {
    return array;
  } else if (array) {
    return [array];
  } else {
    return [];
  }
};

export let errorMessage = (error) => {
  return message(error, 400, []);
};

export let successMessage = (data) => {
  return message('success', 200, data);
};

export let MathUtil = {
  // 获取比例 未带"%"
  getRatio: (value, defaultDecimal = 3) => {
    return parseFloat(value).toFixed(defaultDecimal) * 100;
  },

  getSum: (array, key) => {
    if (array.length < 1) {
      return 0.0;
    } else if (array.length === 1) {
      return array[0][key];
    }
    let sum = 0.0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i][key];
    }

    return sum;
  }
};

export let generateCondition = (condition) => {
  let _condition = {};
  let _array, _key, _value;
  for (let key in condition) {
    if (condition[key].indexOf(':') !== -1) {
      _array = condition[key].split(':');
      _key = _array[0];
      _value = _array[1];
      _condition[key][_key] = _value;
    } else {
      _condition[key] = condition[key];
    }
  }
  return _condition;
};

export let getAnalysis = (type, docs) => {
  switch (type) {
    case 'month':
      return getMonthAnalysis(docs);
    default:
      return {};
  }
};

let getMonthAnalysis = (docs) => {
  let amount = Decimal(0.0);
  let profit = Decimal(0.0);
  for (let i = 0; i < docs.length; i++) {
    profit = profit.add(Decimal(docs[i].extractAmount));
    amount = amount.add(Decimal(docs[i].principal));
  }
  profit = profit.sub(amount);
  return {
    amount: amount.toNumber(),
    profit: profit.toNumber()
  };
};
