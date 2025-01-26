import { AnyWidgetElement, widget } from "./core"
import { Params, router } from "./router"

type JustifyContent = 'space-between' | 'space-around' | 'center' | 'flex-start' | 'flex-end' | 'left' | 'right' | 'stretch'


export const Row = (
  params: {
    justifyContent?: JustifyContent
    children: AnyWidgetElement[]
  }) => widget("div", {
    children: params.children,
    style: {
      display: 'flex',
      justifyContent: params.justifyContent ?? 'flex-start' as JustifyContent,
    },
  })

export const App = (params: Params) => {
  router(params)
}