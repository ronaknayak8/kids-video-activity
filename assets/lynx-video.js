
"use strict";

const RONI_TEXT = "Чуй какво има да ти каже Рони!";

const pageTexts = {
  "001": RONI_TEXT,
  "002": RONI_TEXT,
  "003": RONI_TEXT,
  "004": RONI_TEXT,
  "005": RONI_TEXT,
  "006": RONI_TEXT,
  "007": RONI_TEXT,
  "008": RONI_TEXT,
  "009": RONI_TEXT,

  "010": "Костенурката Фрида",
  "011": "Рибката Нели",
  "012": "Делфинчето Мимо",
  "013": "Октоподчето Джия",
  "014": "Рачето Виктор",
  "015": "Акулата Мона",
  "016": "Мидата Бианка"
};

const videoUrls = {
  "001": "",
  "002": "https://media.taleybox.online/Lynx_cat/6.mp4",
  "003": "https://media.taleybox.online/Lynx_cat/3.mp4",
  "004": "https://media.taleybox.online/Lynx_cat/4.mp4",
  "005": "https://media.taleybox.online/Lynx_cat/7.mp4",
  "006": "",
  "007": "https://media.taleybox.online/Lynx_cat/9.mp4",
  "008": "https://media.taleybox.online/Lynx_cat/2.mp4",
  "009": "https://media.taleybox.online/Lynx_cat/5.mp4",

  "010": "https://media.taleybox.online/dir/Turtle.mp4",
  "011": "https://media.taleybox.online/dir/Copy%20of%20Fish.mp4",
  "012": "https://media.taleybox.online/dir/Copy%20of%20Dolphin.mp4",
  "013": "https://media.taleybox.online/dir/Copy%20of%20Octopus.mp4",
  "014": "https://media.taleybox.online/dir/Copy%20of%20Crab.mp4",
  "015": "https://media.taleybox.online/dir/Copy%20of%20Shark.mp4",
  "016": "https://media.taleybox.online/dir/Copy%20of%20Clam.mp4"
};

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector("[data-activity-id]");
  if (!page) return;

  const id = page.dataset.activityId;
  const title = document.getElementById("activity-title");
  const video = document.getElementById("activity-video");
  const source = document.getElementById("activity-video-source");
  const wrapper = document.querySelector(".video-wrapper");
  const placeholder = document.getElementById("video-placeholder");
  const placeholderText = document.getElementById("placeholder-text");

  if (!title || !video || !source || !wrapper ||
      !placeholder || !placeholderText) {
    console.error("Video template elements are missing.");
    return;
  }

  // Remove old extra page text.
  document.querySelector(".badge")?.remove();
  document.getElementById("activity-description")?.remove();

  if (!pageTexts[id]) {
    title.textContent = "Видео страницата не е намерена";
    document.title = title.textContent;
    placeholderText.textContent = "Тази видео страница не е налична.";
    return;
  }

  title.textContent = pageTexts[id];
  document.title = pageTexts[id];

  function showPlaceholder(message) {
    video.pause();
    video.controls = true;
    video.hidden = true;

    source.removeAttribute("src");
    video.removeAttribute("src");
    video.load();

    wrapper.classList.remove("custom-controls-active");
    wrapper.querySelector(".custom-controls")?.remove();

    placeholder.hidden = false;
    placeholder.classList.remove("is-play-ready");

    placeholder.querySelector(".custom-play-button")?.remove();

    const symbol = placeholder.querySelector(".play-symbol");
    if (symbol) symbol.hidden = false;

    placeholderText.hidden = false;
    placeholderText.textContent = message;
  }

  const url = videoUrls[id];

  if (!url) {
    showPlaceholder("Видеото ще бъде добавено скоро.");
    return;
  }

  let parsed;

  try {
    parsed = new URL(url);
  } catch {
    showPlaceholder("Невалиден видео адрес.");
    return;
  }

  if (parsed.protocol !== "https:" ||
      !/\.mp4$/i.test(parsed.pathname)) {
    showPlaceholder("Добавете публичен HTTPS адрес на MP4 видео.");
    return;
  }

  function makeButton(className, label, symbol, action) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.setAttribute("aria-label", label);
    button.textContent = symbol;
    button.addEventListener("click", action);
    return button;
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);

    return `${minutes}:${String(remaining).padStart(2, "0")}`;
  }

  function createPlayer() {
    const controls = document.createElement("div");
    controls.className = "custom-controls";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", "Видео контроли");

    const progress = document.createElement("input");
    progress.className = "custom-progress";
    progress.type = "range";
    progress.min = "0";
    progress.max = "1000";
    progress.step = "1";
    progress.value = "0";
    progress.setAttribute("aria-label", "Позиция във видеото");
    progress.setAttribute("aria-valuetext", "0:00 от 0:00");

    const row = document.createElement("div");
    row.className = "custom-controls-main";

    const playPause = makeButton(
      "custom-control-button",
      "Пусни видеото",
      "▶",
      () => video.paused ? startPlayback() : video.pause()
    );

    const time = document.createElement("span");
    time.className = "custom-time";
    time.textContent = "0:00 / 0:00";

    const mute = makeButton(
      "custom-control-button",
      "Изключи звука",
      "🔊",
      () => {
        video.muted = !video.muted;

        if (!video.muted && video.volume === 0) {
          video.volume = 0.5;
        }

        updateVolume();
      }
    );

    const volume = document.createElement("input");
    volume.className = "custom-volume";
    volume.type = "range";
    volume.min = "0";
    volume.max = "1";
    volume.step = "0.05";
    volume.value = String(video.volume);
    volume.setAttribute("aria-label", "Сила на звука");

    const fullscreen = makeButton(
      "custom-control-button custom-fullscreen-button",
      "На цял екран",
      "⛶",
      toggleFullscreen
    );

    row.append(playPause, time, mute, volume, fullscreen);
    controls.append(progress, row);

    return { controls, progress, time, playPause, mute, volume, fullscreen };
  }

  let player;

  try {
    player = createPlayer();
    wrapper.querySelector(".custom-controls")?.remove();
    wrapper.appendChild(player.controls);
  } catch (error) {
    console.error("Custom controls could not initialize:", error);
    showPlaceholder("Използвайте стандартните видео контроли.");
    return;
  }

  const {
    controls,
    progress,
    time,
    playPause,
    mute,
    volume,
    fullscreen
  } = player;

  let hideTimer = null;
  const HIDE_DELAY = 2000;

  function updateProgress() {
    const duration = video.duration;
    const current = video.currentTime || 0;
    const total = Number.isFinite(duration) ? formatTime(duration) : "0:00";

    progress.value =
      Number.isFinite(duration) && duration > 0
        ? String(Math.round((current / duration) * 1000))
        : "0";

    time.textContent = `${formatTime(current)} / ${total}`;
    progress.setAttribute(
      "aria-valuetext",
      `${formatTime(current)} от ${total}`
    );
  }

  function updateVolume() {
    const muted = video.muted || video.volume === 0;

    mute.textContent = muted ? "🔇" : "🔊";
    mute.setAttribute("aria-label", muted ? "Включи звука" : "Изключи звука");
    mute.setAttribute("aria-pressed", String(muted));
    volume.value = muted ? "0" : String(video.volume);
  }

  function showControls() {
    controls.classList.remove("controls-hidden");
  }

  function scheduleHide() {
    clearTimeout(hideTimer);

    if (video.paused || video.ended) return;
    if (controls.contains(document.activeElement)) return;

    hideTimer = setTimeout(() => {
      if (video.paused || video.ended) return;
      if (controls.contains(document.activeElement)) return;

      controls.classList.add("controls-hidden");
    }, HIDE_DELAY);
  }

  function updatePlaybackState() {
    const playing = !video.paused && !video.ended;

    playPause.textContent = playing ? "Ⅱ" : "▶";
    playPause.setAttribute(
      "aria-label",
      playing ? "Постави на пауза" : "Пусни видеото"
    );

    placeholder.hidden = playing;

    if (playing) {
      scheduleHide();
    } else {
      clearTimeout(hideTimer);
      showControls();
    }
  }

  async function startPlayback() {
    showControls();

    try {
      await video.play();
    } catch (error) {
      placeholder.hidden = false;
      placeholderText.hidden = false;
      placeholderText.textContent =
        "Неуспешно стартиране. Натисни бутона, за да опиташ отново.";
      console.warn("Playback failed:", error);
    }
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement === wrapper) {
        await document.exitFullscreen();
      } else if (wrapper.requestFullscreen) {
        await wrapper.requestFullscreen();
      } else if (typeof video.webkitEnterFullscreen === "function") {
        // iOS fallback uses native video fullscreen and controls.
        video.controls = true;
        video.webkitEnterFullscreen();
      } else {
        placeholder.hidden = false;
        placeholderText.hidden = false;
        placeholderText.textContent =
          "Целият екран не се поддържа от този браузър.";
      }
    } catch (error) {
      console.warn("Fullscreen failed:", error);
    }

    showControls();
  }

  progress.addEventListener("input", () => {
    if (Number.isFinite(video.duration) && video.duration > 0) {
      video.currentTime =
        (Number(progress.value) / 1000) * video.duration;
    }
    showControls();
    scheduleHide();
  });

  volume.addEventListener("input", () => {
    video.volume = Number(volume.value);
    video.muted = video.volume === 0;
    updateVolume();
    showControls();
    scheduleHide();
  });

  video.addEventListener("loadedmetadata", updateProgress);
  video.addEventListener("timeupdate", updateProgress);
  video.addEventListener("play", updatePlaybackState);
  video.addEventListener("playing", updatePlaybackState);
  video.addEventListener("pause", updatePlaybackState);
  video.addEventListener("ended", updatePlaybackState);
  video.addEventListener("volumechange", updateVolume);

  video.addEventListener("error", () => {
    showPlaceholder("Видеото не се зареди.");
  });

  // Tapping the video reveals controls; it never toggles playback unexpectedly.
  wrapper.addEventListener("pointerdown", (event) => {
    if (!controls.contains(event.target)) {
      showControls();
      scheduleHide();
    }
  });

  wrapper.addEventListener("pointermove", () => {
    showControls();
    scheduleHide();
  });

  controls.addEventListener("pointerdown", showControls);
  controls.addEventListener("pointermove", showControls);

  controls.addEventListener("focusin", () => {
    clearTimeout(hideTimer);
    showControls();
  });

  controls.addEventListener("focusout", () => {
    setTimeout(() => {
      if (!controls.contains(document.activeElement)) {
        scheduleHide();
      }
    }, 0);
  });

  document.addEventListener("fullscreenchange", () => {
    showControls();
    scheduleHide();
  });

  // Install the custom UI before disabling native controls.
  const oldSymbol = placeholder.querySelector(".play-symbol");

  const overlayPlay = makeButton(
    "custom-play-button",
    "Пусни видеото",
    "▶",
    startPlayback
  );

  if (oldSymbol) {
    oldSymbol.replaceWith(overlayPlay);
  } else {
    placeholder.appendChild(overlayPlay);
  }

  placeholder.classList.add("is-play-ready");
  placeholderText.hidden = true;

  source.src = parsed.href;
  video.hidden = false;
  video.controls = false;
  video.playsInline = true;

  wrapper.classList.add("custom-controls-active");

  updatePlaybackState();
  updateVolume();
  video.load();
});
