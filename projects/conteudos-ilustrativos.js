const iframeShells = document.querySelectorAll("[data-iframe-shell]");

function setFrameHeight(iframe, nextHeight, minimumHeight) {
  const safeHeight = Math.max(Number(nextHeight) || minimumHeight, minimumHeight);
  iframe.style.height = `${safeHeight}px`;
}

iframeShells.forEach((shell) => {
  const iframe = shell.querySelector("iframe");
  const minimumHeight = Number(shell.dataset.minHeight || 560);

  if (!iframe) {
    return;
  }

  setFrameHeight(iframe, minimumHeight, minimumHeight);

  iframe.addEventListener("load", () => {
    setFrameHeight(iframe, minimumHeight, minimumHeight);
  });
});

window.addEventListener("message", (event) => {
  const { data } = event;

  if (!data || data.type !== "portfolio:iframe-height") {
    return;
  }

  iframeShells.forEach((shell) => {
    const iframe = shell.querySelector("iframe");
    const minimumHeight = Number(shell.dataset.minHeight || 560);

    if (!iframe) {
      return;
    }

    if (event.source === iframe.contentWindow) {
      setFrameHeight(iframe, data.height, minimumHeight);
    }
  });
});

/*
  Scroll horizontal e drag foram removidos desta página.
  O componente agora prioriza leitura vertical contínua.

  Para páginas embarcadas que você controla, envie a altura assim:

  window.parent.postMessage(
    { type: "portfolio:iframe-height", height: document.body.scrollHeight },
    "*"
  );
*/
