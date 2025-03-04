import { effect } from './signals'

export type AnyWidgetElement = HTMLElement & Widget
export type TStyle = Partial<Record<keyof CSSStyleDeclaration, string>>

type HtmlTag = keyof HTMLElementTagNameMap

type Element = {
  tag: HtmlTag
  params?: TWParams
}

type GenericEventHandler<K extends keyof HTMLElementEventMap> = Partial<
  Record<K, (e: any) => void>
  // Record<K, (e: HTMLElementEventMap[K]) => void>
>

type TEvent = GenericEventHandler<keyof HTMLElementEventMap>

export type TChildren =
  | string
  | AnyWidgetElement
  | (string | AnyWidgetElement)[]
  | (() => (string | AnyWidgetElement)[])
  | (() => string | AnyWidgetElement)

export type TClass = string | string[] | (() => string | string[])

export type TWParams = {
  id?: string
  attributes?: Record<string, string> | (() => Record<string, string>)
  // text?: string | (() => string)
  // child?: AnyWidgetElement
  children?: TChildren
  style?: TStyle | (() => TStyle)
  event?: TEvent
  cb?: (el: AnyWidgetElement) => void
  // items?: TSignal<T[]>
  // builder?: (e: T, index: number) => AnyWidgetElement | undefined
  class?: TClass
  // texts?: (() => string) | (() => string[])
}
class Widget {
  #el: AnyWidgetElement
  // key?: string
  // items?: unknown[]
  _style?: TStyle | (() => TStyle)
  _text?: string | (() => string)
  _event?: TEvent

  constructor(element: Element) {
    this.#el = document.createElement(element.tag) as AnyWidgetElement
    // this.key = hash()
    // this.#el.key = this.key
    // this.#el.key = element.params.key
    this._style = element.params?.style
    // this._text = element.params?.text

    // if (this._text) {
    //   if (typeof this._text === 'function') {
    //     effect(() => {
    //       // @ts-ignore
    //       this.#el.textContent = this._text()
    //     })
    //   } else {
    //     this.#el.textContent = this._text
    //   }
    // }

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

    // if (element.params?.child) {
    //   this.#setChild(element.params?.child)
    // }

    if (element.params?.event) {
      this.#setEvents(element.params?.event)
    }

    if (element.params?.cb !== undefined) {
      element.params?.cb!(this.#el)
    }

    // @ts-ignore
    // this.builder(element?.params?.items!, element?.params?.builder!)

    this.setCssClass(element.params?.class)
    this.setId(element.params?.id)
    this.setDataAttributes(element.params?.attributes)
    // this.setTexts(element.params?.texts)
  }

  #setChildren(children?: TChildren) {
    if (children === undefined || children === null) return

    effect(() => {
      if (typeof children === 'string') {
        this.#el.textContent = children
        return
      }

      if (children instanceof HTMLElement) {
        this.#el.append(children)
        return
      }

      const items = typeof children === 'function' ? children() : children

      // @ts-ignore
      for (let i = 0; i < items.length; i++) {
        // @ts-ignore
        const element = items[i]

        let temp: AnyWidgetElement | Text

        if (typeof element === 'string') {
          temp = document.createTextNode(element)
        } else {
          temp = element
        }

        if (!this.#el.childNodes[i]) {
          this.#el.appendChild(temp)
          continue
        }

        if (this.#el.childNodes[i].isEqualNode(temp) === false) {
          this.#el.childNodes[i].replaceWith(temp)
        }
      }

      // @ts-ignore
      if (this.#el.childNodes.length > items.length) {
        // @ts-ignore
        for (let i = items.length; i <= items.length; i++) {
          this.#el.childNodes[i].remove()
        }
      }
    })
  }

  setDataAttributes(
    attributes?: Record<string, string> | (() => Record<string, string>)
  ) {
    if (attributes === undefined || attributes === null) return

    if (attributes instanceof Function) {
      effect(() => {
        const temp = attributes()
        const temp2 = Object.entries(temp)
        for (let i = 0; i < temp2.length; i++) {
          const [key, value] = temp2[i]
          this.#el.setAttribute(key, value)
        }
      })
    } else {
      const temp = Object.entries(attributes)
      for (let i = 0; i < temp.length; i++) {
        const [key, value] = temp[i]
        this.#el.setAttribute(key, value)
      }
    }
  }

  setId(id?: string) {
    if (id === undefined || id === null) return
    this.#el.id = id
  }

  setCssClass(classParam?: TClass) {
    if (classParam === undefined || classParam === null) return
    if (typeof classParam === 'string') {
      this.#el.classList.add(classParam)
    } else if (Array.isArray(classParam)) {
      this.#el.classList.add(...classParam)
    } else {
      effect(() => {
        const cssClass = classParam()

        if (typeof cssClass === 'string') {
          this.#el.setAttribute('class', cssClass)
        } else {
          this.#el.setAttribute('class', cssClass.join(' '))
        }
      })
    }
  }

  // MARK: TODO BUILDER TO IMPROVE PERFORMANCE
  // builder(
  //   items: TSignal<T[]>,
  //   builder: (e: T, index: number) => AnyWidgetElement
  // ) {
  //   if (!items || !builder) return
  //   effect(() => {
  //     for (let i = 0; i < items.value!.length; i++) {
  //       const element = items!.value![i]
  //       if (this.#el.children[i]) {
  //         if (this.#el.children[i].isEqualNode(builder(element, i)) === false) {
  //           this.#el.children[i].replaceWith(builder(element, i))
  //         }
  //       } else {
  //         this.#el.appendChild(builder(element, i))
  //       }
  //     }
  //     if (this.#el.children.length > items.value!.length) {
  //       for (let i = items.value!.length; i <= items.value!.length; i++) {
  //         this.#el.children[i].remove()
  //       }
  //     }
  //   })
  // }

  #setEvents(events?: TEvent) {
    if (events === undefined) return
    const a = Object.entries(events)
    for (let i = 0; i < a.length; i++) {
      const [k, v] = a[i]
      this.#el.addEventListener(k, (e) => {
        e?.stopPropagation()
        v(e)
      })
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

  // #setChildren = (children?: (AnyWidgetElement | string)[]) => {
  //   if (children?.length === 0 || children === undefined) return
  //   this.#el.append(...children)
  // }

  // #setChild = (child?: AnyWidgetElement) => {
  //   if (child === undefined) return
  //   this.#el.append(child)
  // }

  build() {
    return this.#el as AnyWidgetElement
  }
}

export const widget = (
  htmlTag: HtmlTag,
  params?: TWParams
): AnyWidgetElement => {
  return new Widget({ tag: htmlTag, params }).build()
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
