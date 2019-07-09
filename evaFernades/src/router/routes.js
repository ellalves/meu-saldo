
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('pages/Index.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/frontend/Register.vue')
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/frontend/Login.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/SecureLayout.vue'),
    children: [
      {
        path: 'panel',
        name: 'panel',
        component: () => import('pages/background/Panel.vue')
      },
      {
        path: 'listsUsers',
        name: 'listsUsers',
        component: () => import('pages/background/users/Lists.vue')
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/background/users/Profile.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
