import Store from 'electron-store'

const store = new Store()

export const setInfo = (_, key, value) => {
  store.set(key, value)
}

export const getInfo = (event, key) => {
  // return store.get(key)
  event.returnValue = store.get(key)
}
export const deleteInfo = (_, key) => {
  store.delete(key)
}

export const clearInfo = () => {
  store.clear()
}
