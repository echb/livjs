import {
  type AnyWidgetElement,
  type TChildren,
  type TStyle,
  widget
} from './core'
import { type Routes, router } from './router'

type JustifyContent =
  | 'space-between'
  | 'space-around'
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'left'
  | 'right'
  | 'stretch'

export const Row = (params: {
  justifyContent?: JustifyContent
  children: TChildren
  style?: TStyle
}) =>
  widget('div', {
    children: params.children,
    style: {
      display: 'flex',
      justifyContent: params.justifyContent ?? ('flex-start' as JustifyContent),
      ...params.style
    }
  })

export const Column = (params: {
  justifyContent?: JustifyContent
  children: TChildren
  style?: TStyle
}) =>
  widget('div', {
    children: params.children,
    style: {
      display: 'flex',
      alignItems: params.justifyContent ?? ('flex-start' as JustifyContent),
      flexDirection: 'column',
      ...params.style
    }
  })

export type Params = {
  children?: (AnyWidgetElement | string)[]
  routes?: Routes
  selector?: string
}

export const App = (params: Params) => {
  const fallbackElement = '#app'

  document
    .querySelector(params.selector ?? fallbackElement)
    ?.replaceChildren(...(params?.children ?? []))

  if (params.routes === undefined) return
  router(params.routes)
}

export const Lazy = (
  component: () => Promise<unknown>,
  {
    options,
    loadingChild,
    errorChild,
    errorHandler
  }: {
    options?: IntersectionObserverInit
    loadingChild?: AnyWidgetElement
    errorChild: AnyWidgetElement
    errorHandler: (error: Error) => void
  }
) =>
  widget('div', {
    children: loadingChild,
    cb(el) {
      const fallbackOptions = {
        root: el.parentElement,
        rootMargin: '0px',
        threshold: 1.0,
        ...options
      }

      const callback = (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue
          }

          observer.disconnect()
          requestIdleCallback(() => {
            component()
              .then((e) => {
                // @ts-ignore
                el.replaceWith(e.default)
              })
              .catch((e) => {
                errorHandler(e)
                el.replaceWith(errorChild)
              })
          })
        }
      }

      const observer = new IntersectionObserver(callback, fallbackOptions)
      observer.observe(el)
    }
  })

export const ScopedCss = (params: () => Promise<typeof import('*?inline')>) =>
  widget('style', {
    cb(el) {
      params().then((e) => {
        el.replaceWith(
          widget('style', {
            children: `@scope{${e.default}}`
          })
        )
      })
    }
  })

export const RouterView = () => {
  const routerElement = widget('div', { attributes: { router: '' } })
  return routerElement
}
