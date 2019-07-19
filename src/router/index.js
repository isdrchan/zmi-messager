import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login')
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage')
const details = r => require.ensure([], () => r(require('@/page/details')), 'details')
const message = r => require.ensure([], () => r(require('@/page/message')), 'message')

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    }, {
      path: '/manage',
      name: 'manage',
      component: manage,
      children: [{
        path: '/details',
        component: details,
        meta: ['详情']
      }, {
        path: '/message',
        component: message,
        meta: ['短信']
      }]
    }
  ]
})
