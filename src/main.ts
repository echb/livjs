import { App, derived, effect, signal, type TSignal, widget } from '../lib/main'
import './main.css'

const a: TSignal<number[]> = signal([0])

App({
  children: [
    widget('div', {
      children: ['hello']
      // text: 'hello'
    })
  ]
  // routes: [
  //   { name: 'home', path: '/', component: () => import('./hello') },
  //   { name: 'about', path: '/about', component: () => import('./about.js') },
  // ]
})
