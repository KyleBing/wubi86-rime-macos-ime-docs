<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'mac' | 'ios'
}>(), {
  variant: 'mac'
})

type Frame = {
  text: string
  code: string
  cands: string[]
  hold: number
}

// 先打「五笔」（ggtt），再打 date 上屏一种日期写法。
const frames: Frame[] = [
  { text: '', code: 'g', cands: [], hold: 420 },
  { text: '', code: 'gg', cands: [], hold: 420 },
  { text: '', code: 'ggt', cands: [], hold: 420 },
  { text: '', code: 'ggtt', cands: ['五笔'], hold: 2200 },
  { text: '五笔', code: '', cands: [], hold: 900 },
  { text: '五笔', code: 'd', cands: [], hold: 320 },
  { text: '五笔', code: 'da', cands: [], hold: 320 },
  { text: '五笔', code: 'dat', cands: [], hold: 320 },
  { text: '五笔', code: 'date', cands: ['2026-10-09', '2026/10/09', '2026年10月9日', '10月9日'], hold: 2400 },
  { text: '五笔2026-10-09', code: '', cands: [], hold: 1200 }
]

const text = ref('')
const code = ref('')
const cands = ref<string[]>([])
let timer = 0
let index = 0

const rows = [
  'qwertyuiop'.split(''),
  'asdfghjkl'.split(''),
  'zxcvbnm'.split('')
]

// 当前帧最后一个字母，用来点亮 iOS 键帽。
function pressedKey() {
  return code.value.slice(-1)
}

// 画一帧：正文、下划线编码和候选。
function render(frame: Frame) {
  text.value = frame.text
  code.value = frame.code
  cands.value = frame.cands
}

function step() {
  const frame = frames[index]
  render(frame)
  index = (index + 1) % frames.length
  timer = window.setTimeout(step, frame.hold)
}

onMounted(() => {
  step()
})

onUnmounted(() => {
  window.clearTimeout(timer)
})
</script>

<template>
  <div class="demo">
    <div v-if="props.variant === 'mac'" class="stage">
      <div class="top">
        <span class="dots" aria-hidden="true"><i /><i /><i /></span>
        <span>编码留在光标下，候选在旁边</span>
      </div>
      <div class="doc">
        <p class="line">{{ text }}<span class="caret" aria-hidden="true" /></p>
        <p class="preedit">{{ code }}</p>
        <div class="cand">
          <span v-if="cands.length === 0" class="wait">{{ code ? '继续输入' : '候选' }}</span>
          <template v-for="(word, i) in cands" :key="word">
            <b v-if="i === 0"><span>{{ i + 1 }}</span>{{ word }}</b>
            <em v-else><span>{{ i + 1 }}</span>{{ word }}</em>
          </template>
        </div>
      </div>
    </div>

    <div v-else class="phone">
      <div class="top"><span>信息</span></div>
      <p class="note">{{ text }}<span class="caret" aria-hidden="true" /></p>
      <div class="kb">
        <div class="kb-code">{{ code }}</div>
        <div class="kb-cands">
          <span v-if="cands.length === 0" class="wait">{{ code ? '继续输入' : '候选' }}</span>
          <template v-for="(word, i) in cands" :key="word">
            <b v-if="i === 0"><span>{{ i + 1 }}</span>{{ word }}</b>
            <em v-else><span>{{ i + 1 }}</span>{{ word }}</em>
          </template>
        </div>
        <div v-for="(row, ri) in rows" :key="ri" class="kb-row">
          <button v-if="ri === 2" type="button" class="wide">⇧</button>
          <button
            v-for="key in row"
            :key="key"
            type="button"
            :class="{ down: pressedKey() === key }"
          >{{ key }}</button>
          <button v-if="ri === 2" type="button" class="wide">⌫</button>
        </div>
        <div class="kb-row">
          <button type="button" class="wide">123</button>
          <button type="button" class="space">空格</button>
          <button type="button" class="wide">换行</button>
        </div>
      </div>
    </div>
    <p class="hint">示意在打「五笔」（ggtt），接着打 date。实际上屏取当时的系统时间。</p>
  </div>
</template>

<style scoped>
.demo { margin: 24px 0 8px; }
.stage, .phone {
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}
.top {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 13px;
}
.dots { display: flex; gap: 6px; }
.dots i { width: 10px; height: 10px; border-radius: 50%; display: block; }
.dots i:nth-child(1) { background: #ff5f57; }
.dots i:nth-child(2) { background: #febc2e; }
.dots i:nth-child(3) { background: #28c840; }
.doc { padding: 22px 18px 16px; min-height: 168px; }
.line, .note { margin: 0; font-size: 22px; min-height: 1.4em; }
.note { padding: 16px 14px 8px; font-size: 18px; }
.caret {
  display: inline-block;
  width: 1px;
  height: 1.05em;
  margin-left: 1px;
  background: #3378f5;
  vertical-align: text-bottom;
  animation: blink 1s steps(1) infinite;
}
@keyframes blink { 50% { opacity: 0; } }
.preedit {
  margin: 4px 0 0;
  min-height: 1.2em;
  letter-spacing: 0.04em;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.cand, .kb-cands {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  align-items: center;
  margin-top: 14px;
  min-height: 40px;
  padding: 6px 10px;
  border-radius: 10px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}
.cand b, .kb-cands b {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 2px 8px;
  border-radius: 8px;
  background: #3378f5;
  color: white;
}
.kb-cands b { background: #f95353; }
.cand em, .kb-cands em { font-style: normal; }
.cand span, .kb-cands span { font-size: 12px; opacity: 0.75; }
.wait { color: var(--vp-c-text-2); font-size: 13px; }
.phone { max-width: 420px; }
.kb {
  margin: 0 10px 12px;
  padding: 8px 6px 10px;
  border-radius: 16px;
  background: #d1d5db;
  color: #1c1c1e;
}
.kb-code { min-height: 18px; padding: 0 8px; font-size: 13px; letter-spacing: 0.08em; }
.kb-cands { margin: 4px 4px 8px; background: rgba(255, 255, 255, 0.78); }
.kb-row { display: flex; justify-content: center; gap: 4px; margin-top: 6px; }
.kb-row button {
  flex: 1;
  max-width: 34px;
  height: 38px;
  border: 0;
  border-radius: 6px;
  background: #fff;
  color: #1c1c1e;
  font-size: 15px;
}
.kb-row button.wide, .kb-row button.space { max-width: none; background: #adb3bc; font-size: 13px; }
.kb-row button.space { flex: 4; }
.kb-row button.down { background: #f95353; color: white; }
.hint { margin: 8px 2px 0; color: var(--vp-c-text-2); font-size: 13px; }
</style>
