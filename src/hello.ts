import { widget } from "../lib/core";
import { Navigator } from "../lib/router";
import { signal } from "../lib/signals";
import { count } from "./store";

const aaa = signal([])

export default () => {
  return widget("div", {
    children: [
      widget('div', {
        text: () => 'hello world' + count.value + '/---' + aaa.value?.reduce((a, b) => a + b, 0),
        event: {
          onclick() {
            count.value!++
            Navigator.push('/about')
          }
        }
      }),
    ],
  })
}