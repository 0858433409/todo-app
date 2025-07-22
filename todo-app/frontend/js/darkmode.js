document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".toggle");
  const modeSwitch = document.querySelector(".mode");
  const modeText = document.querySelector(".mode-text");

  // Toggle sidebar
  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("close");
    });
  }

  // Toggle dark mode
  if (modeSwitch && modeText) {
    modeSwitch.addEventListener("click", () => {
      body.classList.toggle("dark");
      modeText.textContent = body.classList.contains("dark")
        ? "Light Mode"
        : "Dark Mode";
    });
  }
});
