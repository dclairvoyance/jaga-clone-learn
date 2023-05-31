
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/users', component: () => import('pages/UserPage.vue') },
      { path: '/companies', component: () => import('pages/CompanyPage.vue') },
    ]
  },

  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
