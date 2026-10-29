
"use strict";

const pageText = "Чуй какво има да ти каже Рони!";
const animalPageTexts = {
  "010": "Костенурката Фрида",
  "011": "Рибката Нели",
  "012": "Делфинчето Мимо",
  "013": "Октоподчето Джия",
  "014": "Рачето Виктор",
  "015": "Акулата Мона",
  "016": "Мидата Бианка"
};

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector("[data-activity-id]");
  if (!page) return;

  const id = page.dataset.activityId;

  const title = document.getElementById("activity-title");
  const video = document.getElementById("activity-video");
  const source = document.getElementById("activity-video-source");
  const placeholder = document.getElementById("video-placeholder");
  const placeholderText = document.getElementById("placeholder-text");

  const headingText = animalPageTexts[id] || pageText;
  document.title = headingText;
  title.textContent = headingText;

  // Add the real public MP4 URL here when each video is ready.
  const videoUrls = {
    "002": "https://media.taleybox.online/Lynx_cat/6.mp4",
    "003": "https://media.taleybox.online/Lynx_cat/3.mp4",
    "004": "https://media.taleybox.online/Lynx_cat/4.mp4",
    "005": "https://media.taleybox.online/Lynx_cat/7.mp4",
    "007": "https://media.taleybox.online/Lynx_cat/7.mp4",
    "008": "https://media.taleybox.online/Lynx_cat/8.mp4",
    "009": "https://media.taleybox.online/Lynx_cat/5.mp4",
    "010": "https://media.taleybox.online/dir/Turtle.mp4",
    "011": "https://media.taleybox.online/dir/Copy%20of%20Fish.mp4",
    "012": "https://media.taleybox.online/dir/Copy%20of%20Dolphin.mp4",
    "013": "https://media.taleybox.online/dir/Copy%20of%20Octopus.mp4",
    "014": "https://media.taleybox.online/dir/Copy%20of%20Crab.mp4",
    "015": "https://media.taleybox.online/dir/Copy%20of%20Shark.mp4",
    "016": "https://media.taleybox.online/dir/Copy%20of%20Shell.mp4"
  };

  function showPlaceholder(message) {
    video.pause();
    source.removeAttribute("src");
    video.load();
    video.hidden = true;
    placeholder.hidden = false;
    placeholderText.textContent = message;
  }

  video.addEventListener("error", () => {
    showPlaceholder("Видеото не се зареди.");
  });

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

  if (
    parsed.protocol !== "https:" ||
    !/\.mp4$/i.test(parsed.pathname)
  ) {
    showPlaceholder("Добавете публичен HTTPS адрес на MP4 видео.");
    return;
  }

  source.src = parsed.href;
  video.hidden = false;
  placeholder.hidden = true;
  video.load();
});
