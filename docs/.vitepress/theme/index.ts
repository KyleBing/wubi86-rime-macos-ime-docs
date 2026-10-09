import DefaultTheme from 'vitepress/theme'
import Figure from './Figure.vue'
import TypingDemo from './TypingDemo.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Figure', Figure)
    app.component('TypingDemo', TypingDemo)
  }
}
