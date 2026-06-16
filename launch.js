(() => {
  const status = document.querySelector("#copy-status");

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function fallbackCopy(text) {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.inset = "0 auto auto 0";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();

    try {
      if (!document.execCommand("copy")) {
        throw new Error("copy command failed");
      }
    } finally {
      field.remove();
    }
  }

  async function writeClipboardText(text) {
    if (!text) {
      throw new Error("missing copy text");
    }

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (error) {
        fallbackCopy(text);
        return;
      }
    }

    fallbackCopy(text);
  }

  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy]");
    if (!button) {
      return;
    }

    try {
      await writeClipboardText(button.dataset.copy);
      setStatus(`${button.textContent.trim()}成功。`);
    } catch (error) {
      setStatus("复制失败，请打开对应链接手动复制。");
    }
  });
})();
