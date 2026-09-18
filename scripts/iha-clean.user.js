// ==UserScript==
// @name         IHA Clean Viewer
// @namespace    https://github.com/
// @version      1.0.0
// @description  Removes GIF covers from IHA thumbnail containers while preserving regular GIF media.
// @match        https://www.iha.ee/*
// @match        https://iha.ee/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
  "use strict";

  const overlaySelector = "a div img[src*='.gif']";

  function isGifCover(image) {
    const container = image.parentElement;
    const source = image.currentSrc || image.src || "";
    return (
      /\.gif(?:[?#]|$)/i.test(source) &&
      container &&
      getComputedStyle(container).backgroundImage !== "none"
    );
  }

  function clean(root = document) {
    const images = [
      ...(root.matches?.(overlaySelector) ? [root] : []),
      ...(root.querySelectorAll ? root.querySelectorAll(overlaySelector) : [])
    ];
    images.forEach((image) => {
      if (isGifCover(image)) image.remove();
    });
  }

  clean();
  new MutationObserver((mutations) => {
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) clean(node);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
