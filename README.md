## What is LivJS?
Livjs is a pure and simple way to build reactive web applications.


## Install
yarn

`yarn create vite my-app --template vanilla-ts`

pnpm

`pnpm create vite my-app --template vanilla-ts`

bun

`bun create vite my-app --template vanilla-ts`

## Basic example
```ts
import { App, widget, signal, type TSignal } from '../lib/main'

const count: TSignal<number> = signal(0)

App({
  children: [
    widget('div', {
      // if you want it to be reactive make it a function
      text: () => `hello world${count.value}`,
      // else it will just stay constant
      text:  `hello world${count.value}`,
      event: {
        onclick() {
          count.value++
        }
      }
    })
  ]
})
```

## Dynamic style example
```ts
import { App, widget, signal, type TSignal } from '../lib/main'

const count: TSignal<number> = signal(0)

App({
  children: [
    widget('div', {
      style: () => ({
        backgroundColor: count.value % 2 === 0 ? 'red' : 'blue'
      }),
      text: () => `hello world${count.value}`,
      event: {
        onclick() {
          count.value++
        }
      }
    })
  ]
})
```

As you can see style and text can be reactive as long as they are functions, by default they are not reactive.


# Router
- **main.ts**
```ts
import { App, widget, signal, type TSignal } from '../lib/main'

const count: TSignal<number> = signal(0)

App({
  routes: [
    {
      name: 'home',
      path: '/',
      component: () => import('./hello')
    },
    {
      name: 'about',
      path: '/about',
      component: () => import('./about')
    }
  ],
  children: [
    widget('div', {
      style: () => ({
        backgroundColor: count.value % 2 === 0 ? 'red' : 'blue'
      }),
      text: () => `hello world${count.value}`,
      event: {
        onclick() {
          count.value++
        }
      }
    })
  ]
})
```
- **hello.ts**
```ts
import { widget } from '../lib/core'
import { Navigator } from '../lib/router'
import { signal } from '../lib/signals'
import { count } from './store'

const aaa = signal([])

export default () => {
  return widget('div', {
    children: [
      widget('div', {
        text: () => `hello world${count.value}`,
        event: {
          onclick() {
            count.value!++
            Navigator.push('/about')
          }
        }
      })
    ]
  })
}
```
- **about.ts**
```ts
import { widget } from '../lib/core'
import { Navigator } from '../lib/router'

export default () => {
  return widget('div', {
    text: 'about',
    event: {
      onclick() {
        Navigator.push('/')
      }
    }
  })
}
```

# TODO

Widget

- builder accept array
- fix event types
- fix event propagation when no event present
- add input elements
