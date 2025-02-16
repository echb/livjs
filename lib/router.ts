import { match } from 'path-to-regexp'
import { type AnyWidgetElement, widget } from './core'

type Route = { name: string; path: string; component: () => Promise<unknown> }
type Routes = Route[]

export type Params = {
  children?: (AnyWidgetElement | string)[]
  routes?: Routes
}

let routes: Routes = []

export const router = (params: Params) => {
  document.querySelector('#app')?.replaceChildren(...(params?.children ?? []))

  if (params.routes === undefined) return

  routes = params.routes!
  const a = widget('div', {})
  a.setAttribute('router', '')

  document.querySelector('#app')?.append(a)

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

  static push = (path: string) => {
    const route = Navigator.findRouteByPath(routes, path)

    if (route?.path === Navigator.current()?.path) return

    history.pushState(null, '', path)
  }

  static pushNamed = (name: string) => {
    const route = Navigator.findRouteByName(routes, name)

    if (route?.path === Navigator.current()?.path) return

    history.pushState(null, '', route?.path)
  }

  static current = () =>
    Navigator.findRouteByPath(routes, window.location.pathname)
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
