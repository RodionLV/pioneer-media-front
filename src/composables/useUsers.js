import { ref, toRef } from 'vue'
import { useAsync } from './useAsync';
import { setActiveUser, updateUser, getUsers } from '../services/admin.service';

let users = ref([])

const {
  exec: execGetUsers,
  state: stateGetUsers
} = useAsync(getUsers)

async function onGetUsers(){
  const response = await execGetUsers()

  users.value = !stateGetUsers.isError ? response.data : [];
}
onGetUsers() 

const updateUsersList = ()=>onGetUsers()

const getUserById = (userId) => users.value.find(u=>u.id == userId)

export function useUsers(){
  const {
    exec: execSetActive,
    state: stateSetActive
  } = useAsync(setActiveUser)
  
  const {
    exec: execUpdateUser,
    state: stateUpdateUser
  } = useAsync(updateUser)

  async function onUpdateUser(userId, {tags, groups}){
    const res = await execUpdateUser({
      id: userId,
      groups: groups,
      tags: tags
    })
  
    if( !stateUpdateUser.isError ){
      const { data: nUser } = res;
  
      let user = toRef(getUserById(userId))
      Object.assign(user.value, nUser)
    }
  }

  async function onSetActive(userId, val){
    await execSetActive({id: userId, active: val})
  
    if( !stateSetActive.isError ){
      let user = toRef(getUserById(userId))
  
      user.value.active = val
    }
  }

  return {
    users,
    stateGetUsers,
    setActive: { exec: onSetActive, state: stateSetActive },
    updateUser: { exec: onUpdateUser, state: stateUpdateUser },
    updateUsersList
  }
}