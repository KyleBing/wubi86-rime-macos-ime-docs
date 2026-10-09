// 两段示意：先打「中国」，再打 date 上屏当天日期的一种写法。
const typingScenes = [
  {
    frames: [
      { text: "", code: "k", cands: [], hold: 420 },
      { text: "", code: "kh", cands: [], hold: 420 },
      { text: "", code: "khl", cands: [], hold: 420 },
      { text: "", code: "khlg", cands: ["中国"], hold: 2200 },
      { text: "中国", code: "", cands: [], hold: 900 }
    ]
  },
  {
    frames: [
      { text: "中国", code: "d", cands: [], hold: 320 },
      { text: "中国", code: "da", cands: [], hold: 320 },
      { text: "中国", code: "dat", cands: [], hold: 320 },
      {
        text: "中国",
        code: "date",
        cands: ["2026-10-09", "2026/10/09", "2026年10月9日", "10月9日"],
        hold: 2400
      },
      { text: "中国2026-10-09", code: "", cands: [], hold: 1200 }
    ]
  }
];

// 把一帧画到打字示意上：正文、下划线编码、候选，以及 iOS 键帽按下态。
function renderTypingFrame(root, frame) {
  const text = root.querySelector("[data-text]");
  const code = root.querySelector("[data-code]");
  const cand = root.querySelector("[data-cands]");
  if (text) text.textContent = frame.text;
  if (code) code.textContent = frame.code;

  if (cand) {
    cand.replaceChildren();
    if (frame.cands.length === 0) {
      const wait = document.createElement("span");
      wait.className = "cand-wait";
      wait.textContent = frame.code ? "继续输入" : "候选";
      cand.append(wait);
    }
    frame.cands.forEach((word, index) => {
      const item = document.createElement(index === 0 ? "b" : "em");
      const num = document.createElement("span");
      num.textContent = String(index + 1);
      item.append(num, document.createTextNode(word));
      cand.append(item);
    });
    cand.hidden = false;
  }

  const pressed = frame.code.slice(-1);
  root.querySelectorAll("[data-key]").forEach((key) => {
    key.classList.toggle("is-down", key.dataset.key === pressed);
  });
}

// 循环播放页面里的每一处打字示意。
function startTypingDemos() {
  document.querySelectorAll("[data-typing]").forEach((root) => {
    const frames = typingScenes.flatMap((scene) => scene.frames);
    let index = 0;

    // 播完当前帧后按停留时间切到下一帧。
    function step() {
      const frame = frames[index];
      renderTypingFrame(root, frame);
      index = (index + 1) % frames.length;
      window.setTimeout(step, frame.hold);
    }

    step();
  });
}

startTypingDemos();
