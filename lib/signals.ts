let subscriber: (() => void) | null = null

export type TSignal<T> = {
  value?: T
}

export function signal<T>(value?: T): TSignal<T> {
  const subscriptions: Set<() => void> = new Set()

  return {
    get value() {
      if (subscriber) {
        subscriptions.add(subscriber)
      }
      return value
    },
    set value(updated) {
      value = updated
      subscriptions.forEach((fn) => fn())
    }
  }
}

export function effect(fn: () => void): void {
  subscriber = fn
  fn()
  subscriber = null
}

export function derived<T>(fn: () => T) {
  const derived = signal()
  effect(() => {
    derived.value = fn()
  })
  return derived
}