import { Login } from '../interface/index'
import { authPort } from '../config/servicePort'

import http from '../index'
export const getFriends = () => {
  return http.get(authPort + `/getFriends`)
}

export const addFriend = (params) => {
  return http.post(authPort + `/addFriend`, params)
}
export const agreeFriend = (params: { friendId }) => {
  return http.get(authPort + `/agreeFriendRequest`, params)
}
export const findFriendRequest = () => {
  return http.get(authPort + `/findFriendRequest`)
}

export const fuzzyFindUser = (params: { username }) => {
  return http.get(authPort + `/fuzzyFindUser`, params)
}

export const logout = () => {
  return http.get(authPort + `/logout`)
}
