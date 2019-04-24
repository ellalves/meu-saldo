
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Dashboard.vue'), name: '' },
      { path: '/dashboard', component: () => import('pages/Dashboard.vue'), name: 'dashboard' },
      { path: 'posts', component: () => import('pages/Posts.vue'), name: 'posts' }
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
