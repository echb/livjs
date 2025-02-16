import { effect, type TSignal } from './signals'

export type AnyWidgetElement = HTMLElement & Widget<unknown>
type TStyle = Partial<Record<keyof CSSStyleDeclaration, string>>

type HtmlTag = keyof HTMLElementTagNameMap

type Element<T> = {
  tag: HtmlTag
  params?: Params<T>
}
type TEvent = Partial<Record<keyof GlobalEventHandlers, (e: unknown) => void>>

type Params<T> = {
  text?: string | (() => string)
  child?: AnyWidgetElement
  children?: (AnyWidgetElement | string)[]
  style?: TStyle | (() => TStyle)
  event?: TEvent
  cb?: (el: AnyWidgetElement) => void
  items?: TSignal<T[]>
  builder?: (e: T, index: number) => AnyWidgetElement | undefined
}

class Widget<T> {
  #el: AnyWidgetElement
  // key?: string
  items?: unknown[]
  _style?: TStyle | (() => TStyle)
  _text?: string | (() => string)
  _event?: TEvent

  constructor(element: Element<T>) {
    this.#el = document.createElement(element.tag) as AnyWidgetElement
    // this.key = hash()
    // this.#el.key = this.key
    // this.#el.key = element.params.key
    this._style = element.params?.style
    this._text = element.params?.text

    if (this._text) {
      if (typeof this._text === 'function') {
        effect(() => {
          // @ts-ignore
          this.#el.textContent = this._text()
        })
      } else {
        this.#el.textContent = this._text
      }
    }

    if (this._style) {
      if (typeof this._style === 'function') {
        effect(() => {
          // @ts-ignore
          this.#setStyle(this._style())
        })
      } else {
        this.#setStyle(this._style)
      }
    }

    if (element.params?.children) {
      this.#setChildren(element.params?.children)
    }

    if (element.params?.child) {
      this.#setChild(element.params?.child)
    }

    if (element.params?.event) {
      this.#setEvents(element.params?.event)
    }

    if (element.params?.cb !== undefined) {
      element.params?.cb!(this.#el)
    }

    // @ts-ignore
    this.builder(element?.params?.items!, element?.params?.builder!)
  }

  // MARK: TODO BUILDER TO IMPROVE PERFORMANCE
  builder(
    items: TSignal<T[]>,
    builder: (e: T, index: number) => AnyWidgetElement
  ) {
    if (!items || !builder) return
    effect(() => {
      for (let i = 0; i < items.value!.length; i++) {
        const element = items!.value![i]
        if (this.#el.children[i]) {
          if (this.#el.children[i].isEqualNode(builder(element, i)) === false) {
            this.#el.children[i].replaceWith(builder(element, i))
          }
        } else {
          this.#el.appendChild(builder(element, i))
        }
      }
      if (this.#el.children.length > items.value!.length) {
        for (let i = items.value!.length; i <= items.value!.length; i++) {
          this.#el.children[i].remove()
        }
      }
    })
  }

  #setEvents(events?: TEvent) {
    if (events === undefined) return
    const a = Object.entries(events)
    for (let i = 0; i < a.length; i++) {
      const [k, v] = a[i]
      // @ts-ignore
      this.#el[k] = (e) => {
        e.stopPropagation()
        // @ts-ignore
        v(e)
      }
    }
  }

  #setStyle = (style: TStyle) => {
    if (style === undefined) return
    const a = Object.entries(style)
    for (let i = 0; i < a.length; i++) {
      const [k, v] = a[i]
      // @ts-ignore
      this.#el.style[k] = v
    }
  }

  #setChildren = (children?: (AnyWidgetElement | string)[]) => {
    if (children?.length === 0 || children === undefined) return
    this.#el.append(...children)
  }

  #setChild = (child?: AnyWidgetElement) => {
    if (child === undefined) return
    this.#el.append(child)
  }

  build() {
    return this.#el as AnyWidgetElement
  }
}

export const widget = <T>(
  htmlTag: HtmlTag,
  params?: Params<T>
): AnyWidgetElement => {
  return new Widget<T>({ tag: htmlTag, params }).build()
}

export class Style implements TStyle {
  constructor(params: TStyle) {
    Object.assign(this, params)
  }
}

// @ts-ignore
function hash(randomness = 3) {
  return [...crypto.getRandomValues(new Uint8Array(randomness))]
    .map((m) => m.toString(16))
    .join('')
}
