import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/login/index.vue')
  },
  {
    path: '/mainMenu',
    name: 'mainMenu',
    component: () => import('../pages/mainMenu/index.vue'),
    children: [
      {
        path: '/chatList',
        name: 'chatList',
        component: () => import('../pages/chatList/index.vue'),
        children: [
          {
            path: '',
            name: 'chatDefault',
            component: () => import('../pages/chatDefault/index.vue')
          },
          {
            path: '/chatDefault',
            component: () => import('../pages/chatDefault/index.vue')
          },
          {
            path: '/chat',
            name: 'chat',
            component: () => import('../pages/chat/index.vue')
          }
        ]
      },
      {
        path: '/chatFriends',
        name: 'chatFriends',
        component: () => import('../pages/chatFriends/index.vue'),
        children: [
          {
            path: '',
            name: 'chatDefault',
            component: () => import('../pages/chatDefault/index.vue')
          },
          {
            path: '/friendNotice',
            name: 'friendNotice',
            component: () => import('../pages/friendNotice/index.vue')
          }

          // {
          //   path: '/chatDefault',
          //   component: () => import('../pages/chatDefault/index.vue')
          // },
          // {
          //   path: '/chat/:id',
          //   name: 'chat',
          //   component: () => import('../pages/chat/index.vue')
          // }
        ]
      }
    ]
  },
  {
    path: '/searchFriend',
    name: 'searchFriend',
    component: () => import('../pages/searchFriend/index.vue')
  },
  {
    path: '/addFriend/:friendInfo',
    name: 'addFriend',
    component: () => import('../pages/addFriend/index.vue')
  },
  {
    path: '/videoChat/:room/:isPhone',
    name: 'videoChat',
    component: () => import('../pages/videoChat/index.vue')
  }
  // {
  //   path: '/setting',
  //   name: 'setting',
  //   component: () => import('../pages/setting.vue'),
  //   children: [
  //     {
  //       path: '/setting',
  //       redirect: '/webcamSetting'
  //     },
  //     {
  //       path: '/webcamSetting',
  //       name: 'webcamSetting',
  //       component: () => import('../pages/webcamSetting.vue')
  //     },
  //     {
  //       path: '/faceModel',
  //       name: 'faceModel',
  //       component: () => import('../pages/faceModel.vue')
  //     },
  //     {
  //       path: '/backgroundCut',
  //       name: 'backgroundCut',
  //       component: () => import('../pages/backgroundCut.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/recording',
  //   name: 'recording',
  //   component: () => import('../components/screen.vue')
  // },
  // {
  //   path: '/webcam',
  //   name: 'webcam',
  //   component: () => import('../components/webcam.vue')
  // },
  // {
  //   path: '/countDown',
  //   name: 'countDown',
  //   component: () => import('../pages/countDown.vue')
  // }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
