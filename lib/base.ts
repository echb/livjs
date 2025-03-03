import {
  type AnyWidgetElement,
  type TChildren,
  type TStyle,
  type TWParams,
  widget
} from './core'
import { router, type Routes } from './router'

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
  router(params.routes, params.selector ?? fallbackElement)
}

type TargetObject = Record<
  Partial<keyof HTMLElementTagNameMap>,
  (params?: TWParams) => AnyWidgetElement
>

const handler = {
  get(_: TargetObject, prop: keyof HTMLElementTagNameMap, __: unknown) {
    return (params?: TWParams) => widget(prop, params)
  }
}

// @ts-ignore
export const tags: TargetObject = new Proxy({}, handler)
