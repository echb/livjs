import { match } from 'path-to-regexp'
import { widget } from './core'

export type Route = {
  name: string
  path: string
  component: () => Promise<unknown>
}
export type Routes = Route[]

let routes: Routes = []

export const router = (pRoutes: Routes, selector: string) => {
  routes = pRoutes!
  const routerElement = widget('div')
  routerElement.setAttribute('router', '')

  document.querySelector(selector!)?.append(routerElement)

  window.addEventListener('load', async () => {
    window.history.replaceState(null, '', window.location.pathname)
  })

  handle()
  // @ts-ignore
  window.navigation.addEventListener('navigate', async () => {
    await handle()
  })
}

export class Navigator {
  static findRouteByPath(routes: Routes, path: string) {
    for (let i = 0; i < routes.length; i++) {
      const e = routes[i]
      const fn = match(e.path)
      const a = fn(path)

      if (a !== false) {
        return { ...a, c: routes[i] }
      }
      if (a === false) continue
    }
    return null
  }

  static findRouteByName = (routes: Routes, name: string) =>
    routes.find((e) => e.name === name)

  static push = (path: string, data?: unknown) => {
    const route = Navigator.findRouteByPath(routes, path)

    if (route?.path === Navigator.current()?.path) return

    window.history.pushState(data, '', path)
  }

  static pushNamed = (name: string, data?: unknown) => {
    const route = Navigator.findRouteByName(routes, name)

    if (route?.path === Navigator.current()?.path) return

    window.history.pushState(data, '', route?.path)
  }

  static replaceNamed = (name: string, data?: unknown) => {
    const route = Navigator.findRouteByName(routes, name)

    if (route?.path === Navigator.current()?.path) return

    window.history.replaceState(data, '', route?.path)
  }

  static replace = (path: string, data?: unknown) => {
    const route = Navigator.findRouteByPath(routes, path)

    if (route?.path === Navigator.current()?.path) return

    window.history.replaceState(data, '', path)
  }

  static go = (qo: number) => {
    window.history.go(qo)
  }

  static current = () =>
    Navigator.findRouteByPath(routes, window.location.pathname)

  static params = () => Navigator.current()?.params
}

async function handle() {
  await new Promise((r) =>
    setTimeout(() => {
      r(null)
    }, 0)
  )
  const cp = Navigator.findRouteByPath(routes, window.location.pathname)
  const comp = await cp?.c.component()
  // @ts-ignore
  document.querySelector('[router]')?.replaceChildren(comp.default())
}
