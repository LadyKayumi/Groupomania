import { createRouter, createWebHistory } from 'vue-router'
import Feed from '../views/Feed.vue'
import Login from '../views/Login.vue'
import Logout from '../views/Logout.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import UserEdit from '../views/UserEdit.vue'
import PostCreation from '../views/PostCreation.vue'
import Post from '../views/Post.vue'
import PageNotFound from '../views/404.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/',
    name: 'Feed',
    component: Feed
  },
  {
    path: '/user/:username',
    name: 'User',
    component: User,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/user/:username/edit',
    name: 'UserEdit',
    component: UserEdit,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: Post
  },
  {
    path: '/post',
    name: 'PostCreation',
    component: PostCreation,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/pageNotFound',
    name: 'PageNotFound',
    component: PageNotFound
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

import store from '../store/index'

router.beforeEach(async (to, from) => {
  let readRules = localStorage.getItem('readRules')
  if(!readRules) {
    readRules = false
  } else {
    if(readRules == 'true') {
      readRules = true
    } else {
      readRules = false
    }
  }
  store.commit('SET_READ_RULES', {read: readRules, checked: true})
  store.commit('SET_SEARCH', '')
  if (!store.state.isLoggedIn)
    await autoLogin()
  if (!to.matched.length)
    return { name: 'PageNotFound' }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.isLoggedIn) {
      return { name: 'Login' }
    }
    else {
      await getUsersList()
      return
    }
  }
  else {
    if (store.state.isLoggedIn && (to.name === 'Login' || to.name === 'Register')) {
      await getUsersList()
      return { name: 'Feed' }
    }
    else {
      await getUsersList()
      return
    }
  }
})

const autoLogin = async () => {
  const requestSettings = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: "include",
    body: JSON.stringify({
      autoLogin: true
    })
  }
  try {
    const res = await fetch(`${store.state.apiURL}/auth/login`, requestSettings)
    const json = await res.json()
    if (res.ok) {
      store.commit('SET_LOGIN_STATE', true)
      store.commit('SET_USER', json.user)
    }
  }
  catch (err) {
    return
  }
  try {
    const upvotesRequestSettings = {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include"
    }
    const res = await fetch(`${store.state.apiURL}/upvote/user/${store.state.user.username}`, upvotesRequestSettings)
    const upvotes = await res.json()
    if (res.ok) {
      store.commit('SET_UPVOTES', upvotes)
    }
  }
  catch (err) {
    return
  }
}

const getUsersList = async () => {
  try {
    const usersRequestSettings = {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include"
    }
    const res = await fetch(`${store.state.apiURL}/user`, usersRequestSettings)
    const users = await res.json()
    if (res.ok) {
      store.commit('SET_USERS_LIST', users.sort((a, b) => a.username.localeCompare(b.username)))
    }
  }
  catch (err) {
    return
  }
}

export default router
