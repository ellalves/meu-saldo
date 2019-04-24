
const routes = [
  {
    path: '/',
    component: () => import('layouts/FrontLayout.vue'),
    meta: {
      requiresAuth: false
    },
    children: [
      { path: '', name: 'home', component: () => import('pages/Index.vue') },
      {
        path: '/meu-perfil',
        name: 'my-profile',
        component: () => import('pages/auth/Profile.vue'),
        meta: {
          requiresAuth: true,
          permissions: ['edit_user']
        }
      },
      {
        path: '/nao-autorizado',
        name: 'not-authorized',
        component: () => import('pages/auth/NotAuthorized.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/BlankLayout.vue'),
    meta: {
      requiresAuth: false
    },
    children: [
      { path: '/login', name: 'login', component: () => import('pages/auth/Login.vue') },
      { path: '/cadastre-se', name: 'register', component: () => import('pages/auth/Register.vue') },
      { path: '/recuperar-senha', name: 'forgot-password', component: () => import('pages/auth/Register.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/BackendLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('pages/backend/Dashboard.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/tickets',
        name: 'tickets',
        component: () => import('pages/tickets/Tickets.vue'),
        meta: {
          permissions: ['list_billets']
        }
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import('pages/users/Roles.vue'),
        meta: {
          permissions: ['list_roles']
        }
      },
      {
        path: '/permissions',
        name: 'permissions',
        component: () => import('pages/users/Permissions.vue'),
        meta: {
          permissions: ['list_permissions']
        }
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('pages/users/Users.vue'),
        meta: {
          permissions: ['list_users']
        }
      },
      {
        path: '/alterar-senha',
        name: 'change-password',
        component: () => import('pages/auth/ChangePassword.vue')
      }, {
        path: '/alterar-imagem',
        name: 'change-image',
        component: () => import('pages/auth/ChangeImage.vue')
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
