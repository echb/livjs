import { widget, type AnyWidgetElement, type TWParams } from './core'

type TTagOptions = Record<
  Partial<keyof HTMLElementTagNameMap>,
  (params?: TWParams) => AnyWidgetElement
>

const handler = {
  get(_: TTagOptions, prop: keyof HTMLElementTagNameMap, __: unknown) {
    return (params?: TWParams) => widget(prop, params)
  }
}

// @ts-ignore
export const tags: TTagOptions = new Proxy({}, handler)
