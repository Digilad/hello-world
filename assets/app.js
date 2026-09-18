(() => {
  "use strict";

  // IHA changes the transparent cover filename. The stable thumbnail trait is
  // a GIF <img> in a linked <div> that already has the real image as a CSS
  // background. This deliberately preserves ordinary GIF media.
  const cleanerSource = `(() => {
    "use strict";
    const overlaySelector = "a div img[src*='.gif']";
    let removed = 0;
    const isCover = (image) => {
      const container = image.parentElement;
      return container && getComputedStyle(container).backgroundImage !== "none";
    };
    const clean = (root = document) => {
      const images = [
        ...(root.matches?.(overlaySelector) ? [root] : []),
        ...(root.querySelectorAll ? root.querySelectorAll(overlaySelector) : [])
      ];
      images.forEach((image) => {
        const source = image.currentSrc || image.src || "";
        if (/\\.gif(?:[?#]|$)/i.test(source) && isCover(image)) {
          image.remove();
          removed += 1;
        }
      });
    };
    clean();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(({ addedNodes }) => addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) clean(node);
      }));
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    const id = "iha-clean-viewer-status";
    document.getElementById(id)?.remove();
    const status = document.createElement("div");
    status.id = id;
    status.textContent = "IHA Clean: удалено GIF-слоёв — " + removed;
    status.style.cssText = "position:fixed;z-index:2147483647;right:16px;bottom:16px;padding:9px 12px;border-radius:8px;background:#12161feF;color:#fff;font:600 13px system-ui;box-shadow:0 4px 18px #0008";
    document.body.append(status);
    setTimeout(() => status.remove(), 3200);
  })();`;

  const bookmarklet = `javascript:${encodeURIComponent(cleanerSource)}`;
  const link = document.querySelector("#bookmarklet");
  const copyButton = document.querySelector("#copy-button");
  const status = document.querySelector("#copy-status");
  link.href = bookmarklet;

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(bookmarklet);
      status.textContent = "Готово: URL закладки скопирован.";
    } catch {
      status.textContent = "Не удалось скопировать автоматически. Перетащите кнопку в панель закладок.";
    }
  });
})();
