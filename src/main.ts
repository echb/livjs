import { App } from '../lib/main'
import './main.css'

App({
  routes: [
    { name: 'home', path: '/', component: () => import('./hello') },
    { name: 'about', path: '/about', component: () => import('./about.js') },
  ]
})