
import { widget } from "../lib/core";
import { Navigator } from "../lib/router";

export default () => {
  return widget('div', {
    text: 'about',
    event: {
      onclick() {
        Navigator.push('/')
      }
    }
  })
}