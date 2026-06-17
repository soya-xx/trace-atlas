const copyButton = document.querySelector("#copy-pack-page");
const statusNode = document.querySelector("#pack-status");
const markdownNode = document.querySelector("#pack-markdown");

function setStatus(message) {
  if (statusNode) {
    statusNode.textContent = message;
  }
}

function packMarkdown() {
  if (!markdownNode) {
    return "";
  }
  return JSON.parse(markdownNode.textContent);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
}

copyButton?.addEventListener("click", async () => {
  await copyText(packMarkdown());
  setStatus("行动包已复制。");
});
