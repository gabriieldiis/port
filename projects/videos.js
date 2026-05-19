const videoDialog = document.querySelector("#video-dialog");
const videoCards = document.querySelectorAll(".video-card");
const videoPlayer = document.querySelector("#video-player");
const videoEmptyState = document.querySelector("#video-empty-state");
const videoCloseButton = document.querySelector("#video-dialog-close");

const modalFields = {
  category: document.querySelector("#modal-category"),
  title: document.querySelector("#modal-title"),
  client: document.querySelector("#modal-client"),
  goal: document.querySelector("#modal-goal"),
  campaign: document.querySelector("#modal-campaign"),
  year: document.querySelector("#modal-year"),
  tools: document.querySelector("#modal-tools"),
};

function setText(target, value) {
  if (target) {
    target.textContent = value || "";
  }
}

function openVideoModal(card) {
  if (!videoDialog || !videoPlayer) {
    return;
  }

  const src = card.dataset.videoSrc || "";

  setText(modalFields.category, card.dataset.category);
  setText(modalFields.title, card.dataset.title);
  setText(modalFields.client, card.dataset.client);
  setText(modalFields.goal, card.dataset.goal);
  setText(modalFields.campaign, card.dataset.campaign);
  setText(modalFields.year, card.dataset.year);
  setText(modalFields.tools, card.dataset.tools);

  videoPlayer.pause();
  videoPlayer.removeAttribute("src");

  if (src) {
    videoPlayer.src = src;
    videoPlayer.load();
  }

  videoEmptyState?.classList.toggle("is-hidden", Boolean(src));
  videoDialog.showModal();
}

function closeVideoModal() {
  if (!videoDialog || !videoPlayer) {
    return;
  }

  videoPlayer.pause();
  videoPlayer.removeAttribute("src");
  videoPlayer.load();

  if (videoDialog.open) {
    videoDialog.close();
  }
}

videoCards.forEach((card) => {
  card.addEventListener("click", () => openVideoModal(card));
});

videoCloseButton?.addEventListener("click", closeVideoModal);

videoPlayer?.addEventListener("error", () => {
  videoEmptyState?.classList.remove("is-hidden");
});

videoDialog?.addEventListener("click", (event) => {
  if (event.target === videoDialog) {
    closeVideoModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && videoDialog?.open) {
    closeVideoModal();
  }
});
