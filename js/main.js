const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach(item => observer.observe(item));

const music = document.getElementById("backgroundMusic");

// Try audible autoplay as soon as the page loads.
// Browsers may block it until the visitor interacts with the page.
music.volume = 0.38;
let musicStarted = false;

async function startBackgroundMusic() {
  if (musicStarted) return;
  try {
    await music.play();
    musicStarted = true;
    const prompt = document.getElementById("musicStartPrompt");
    if (prompt) prompt.remove();
    document.removeEventListener("pointerdown", startBackgroundMusic);
    document.removeEventListener("keydown", startBackgroundMusic);
  } catch (error) {
    // Audible autoplay was blocked by the browser. Ask for one interaction,
    // then start music; there is deliberately no on/off toggle.
    if (!document.getElementById("musicStartPrompt")) {
      const prompt = document.createElement("button");
      prompt.id = "musicStartPrompt";
      prompt.className = "music-start-prompt";
      prompt.type = "button";
      prompt.textContent = "♫  Tap anywhere to begin";
      prompt.setAttribute("aria-label", "Start background music");
      prompt.addEventListener("click", startBackgroundMusic, { once: true });
      document.body.appendChild(prompt);
    }
    document.addEventListener("pointerdown", startBackgroundMusic, { once: true });
    document.addEventListener("keydown", startBackgroundMusic, { once: true });
  }
}

startBackgroundMusic();

document.getElementById("backTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
