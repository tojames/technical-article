export function mapState(stateArr) {
  let obj = {}
  stateArr.forEach((stateName) => {
    obj[stateName] = function () {
      return this.$store.state[stateName]
    }
  })
  return obj
}

export function mapGetter(getterArr) {
  let obj = {}
  getterArr.forEach((getterName) => {
    obj[getterName] = function () {
      return this.$store.getters[getterName]
    }
  })
  return obj
}

export function mapMutation(mutationArr) {
  let obj = {}
  mutationArr.forEach((mutationName) => {
    obj[mutationName] = function (payload) {
      this.$store._mutations[mutationName].forEach((mutation) => mutation(payload))
    }
  })
  return obj
}

export function mapActiontion(actionArr) {
  let obj = {}
  normalizeMap(actionArr).forEach((item) => {
    console.log(item, "item")
    obj[item.val] = function (payload) {
      this.$store._actions[item.key].forEach((action) => action(payload))
    }
  })
  return obj
}

/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
function normalizeMap(map) {
  if (!isValidMap(map)) {
    return []
  }
  return Array.isArray(map)
    ? map.map((key) => ({ key, val: key }))
    : Object.keys(map).map((key) => ({ key, val: map[key] }))
}

/**
 * Validate whether given map is valid or not
 * @param {*} map
 * @return {Boolean}
 */
function isValidMap(map) {
  return Array.isArray(map) || isObject(map)
}

export function isObject(obj) {
  return obj !== null && typeof obj === "object"
}
