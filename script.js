const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const logOutput = document.getElementById("logOutput");

let logsData = [];
let chart;

// DRAG DROP
dropZone.onclick = () => fileInput.click();

dropZone.addEventListener("dragover", e => {
  e.preventDefault();
  dropZone.style.borderColor = "yellow";
});

dropZone.addEventListener("dragleave", () => {
  dropZone.style.borderColor = "#38bdf8";
});

dropZone.addEventListener("drop", e => {
  e.preventDefault();
  handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener("change", () => {
  handleFile(fileInput.files[0]);
});

function handleFile(file) {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const lines = e.target.result.split("\n");

    let error = 0, warning = 0, info = 0;
    logsData = [];

    lines.forEach(line => {
      let type = "info";

      if (line.toLowerCase().includes("error")) {
        type = "error"; error++;
      } else if (line.toLowerCase().includes("warning")) {
        type = "warning"; warning++;
      } else {
        info++;
      }

      logsData.push({ text: line, type });
    });

    document.getElementById("errorCount").textContent = error;
    document.getElementById("warningCount").textContent = warning;
    document.getElementById("infoCount").textContent = info;

    renderChart(error, warning, info);
    displayLogs();
  };

  reader.readAsText(file);
}

// CHART
function renderChart(error, warning, info) {
  const ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Errors", "Warnings", "Info"],
      datasets: [{
        data: [error, warning, info]
      }]
    }
  });
}

// DISPLAY LOGS
function displayLogs() {
  const search = searchInput.value.toLowerCase();
  const filter = filterSelect.value;

  logOutput.innerHTML = "";

  logsData.forEach(log => {
    if (
      (filter === "all" || log.type === filter) &&
      log.text.toLowerCase().includes(search)
    ) {
      const div = document.createElement("div");
      div.textContent = log.text;
      div.classList.add("log-" + log.type);
      logOutput.appendChild(div);
    }
  });
}

searchInput.addEventListener("input", displayLogs);
filterSelect.addEventListener("change", displayLogs);

const health = document.getElementById("health");

if (error > 5) {
  health.textContent = "Critical";
  health.className = "critical";
} else if (warning > 3) {
  health.textContent = "Warning";
  health.className = "warning-text";
} else {
  health.textContent = "Good";
  health.className = "good";
}