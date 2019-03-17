import Vue from 'vue'
import Router from 'vue-router'
import list from '$components/list.vue'
import list2 from '$components/list2.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'list',
      component: list,
      meta:{
        msg:'展示数据'
      }
    },
    {
      path: '/list2',
      name: 'list2',
      component: list2,
      meta:{
        msg:'增删查改'
      }
    }
  ]
})
