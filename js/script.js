const fileInput = document.querySelector("input");
const img = document.getElementById("previewImage");
const qrCodeView = document.querySelector(".qrCodeView");
const iconGroup = document.querySelector(".iconGroup");
const textarea = document.querySelector("textarea");
const displayMessage = document.querySelector(".iconGroup p");
const qrTextDetails = document.querySelector(".qrTextDetails");
const stopScan = document.getElementById("stopScan");
const readerDiv = document.getElementById("reader");
const uploadBtn = document.getElementById("uploadBtn");
const cameraBtn = document.getElementById("cameraBtn");
const copyBtn = document.querySelector(".copy");
const closeBtn = document.querySelector(".close");

let html5QrCode;

// =======================
// IMAGE UPLOAD
// =======================

uploadBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
  let file = e.target.files[0];
  if (!file) return;

  let formData = new FormData();
  formData.append("file", file);

  displayMessage.innerText = "Scanning QR Code...";

  fetch("https://api.qrserver.com/v1/read-qr-code/", {
    method: "POST",
    body: formData,
  })
    .then(res => res.json())
    .then(result => {
      let text = result[0].symbol[0].data;

      if (!text) {
        displayMessage.innerText = "Couldn't scan QR Code";
        return;
      }

      img.src = URL.createObjectURL(file);
      img.style.display = "block";

      qrTextDetails.style.display = "block";
      iconGroup.style.display = "none";

      textarea.value = text;
    })
    .catch(() => {
      displayMessage.innerText = "Error scanning QR Code";
    });
});

// =======================
// CAMERA SCAN
// =======================

cameraBtn.addEventListener("click", () => {
  displayMessage.innerText = "Starting camera...";
  iconGroup.style.display = "none";
  stopScan.style.display = "inline";

  html5QrCode = new Html5Qrcode("reader");

  Html5Qrcode.getCameras()
    .then(devices => {
      if (devices.length) {
        html5QrCode.start(
          devices[0].id,
          { fps: 10, qrbox: 250 },
          decodedText => {
            html5QrCode.stop();
            stopScan.style.display = "none";
            qrTextDetails.style.display = "block";
            textarea.value = decodedText;
          }
        );
      }
    })
    .catch(() => {
      displayMessage.innerText = "Camera permission denied";
    });
});

stopScan.addEventListener("click", () => {
  if (html5QrCode) {
    html5QrCode.stop().then(() => resetUI());
  }
});

// =======================
// COPY
// =======================

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(textarea.value);
  copyBtn.innerText = "Copied!";
  setTimeout(() => copyBtn.innerText = "Copy", 1500);
});

// =======================
// CLOSE / RESET
// =======================

closeBtn.addEventListener("click", resetUI);

function resetUI() {
  textarea.value = "";
  img.style.display = "none";
  qrTextDetails.style.display = "none";
  iconGroup.style.display = "block";
  stopScan.style.display = "none";
  displayMessage.innerText = "Upload or Scan QR Code";
}