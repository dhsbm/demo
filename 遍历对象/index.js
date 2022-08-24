let sy = Symbol()
let obj = {
  a: 1,
  b: 2,
  [sy]: 'symbol',
}

// for in 会丢失symbol 还会迭代原型链上的属性
for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key, obj[key])
  }
}

// 关键在于Symbol.iterator
for (const key of [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)]) {
  console.log(key, obj[key])
}

Object.prototype[Symbol.iterator] = function* () {
  let keys = Object.getOwnPropertyNames(this)
  let symbols = Object.getOwnPropertySymbols(this)
  for (let i = 0; i < keys.length; i++) {
    // yield [keys[i], this[keys[i]]]
    yield keys[i]
  }
  for (let i = 0; i < symbols.length; i++) {
    // yield [keys[i], this[keys[i]]]
    yield symbols[i]
  }
}
for (const key of obj) {
  console.log(key, obj[key])
}
