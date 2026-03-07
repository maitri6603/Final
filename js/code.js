document.addEventListener("DOMContentLoaded", () => {
  const modules = [
    "HTML Structure",
    "CSS Styling",
    "JavaScript Logic",
    "Three.js Renderer",
    "WebXR / AR.js"
  ];

  modules.forEach((module, index) => {
    console.log(`Module ${index + 1}: ${module}`);
  });
});