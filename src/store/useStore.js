import Notification from './interfaces/Notification'
import User from './interfaces/User'
import Setup from './interfaces/Setup'

import { watch, reactive, toRef } from 'vue'

const STORAGE_KEY = "pioneer_manage_media"

let store = reactive({
  localStorage: {
    setup: {}
  },
  
  sessionStorage: {
    notification: {
      error: "",
      success: "",
      info: ""
    },
    user: null
  },
})

Object.assign(
  store.localStorage, 
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") 
)

Object.assign(
  store.sessionStorage,
  JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}")
)


watch(
  ()=>store.localStorage,
  ()=>localStorage.setItem(STORAGE_KEY, JSON.stringify(store.localStorage)),
  {deep: true}
)

watch(
  ()=>store.sessionStorage,
  ()=>sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store.sessionStorage)),
  {deep: true}
)

const scopes = {
  "user": new User( toRef(store.sessionStorage, 'user') ),
  "notification": new Notification( toRef(store.sessionStorage, 'notification')),
  "setup": new Setup( toRef(store.localStorage, 'setup') )
}

export function isAuth(){
  return scopes["user"].isUser()
}

export function useStore(scope){
  if(scope === undefined) return { store }
 
  return {
    store: scopes[scope]
  }
}

