const data = {
  "Traxxas Slash": {
    "Wheel Hex": "12mm",
    "Offset": "+13mm Front & Rear",
    "Tire": "SCT 2.2\"/3.0\"",
    "Upgrades": [
      "Aluminum Hex Hubs (45004)",
      "All-terrain SCT Tires"
    ]
  }
};

document.getElementById("searchBtn").addEventListener("click", () => {
  const model = document.getElementById("modelInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (data[model]) {
    const info = data[model];
    resultDiv.innerHTML = `
      <h2>${model}</h2>
      <p><strong>Wheel Hex:</strong> ${info["Wheel Hex"]}</p>
      <p><strong>Offset:</strong> ${info["Offset"]}</p>
      <p><strong>Tire:</strong> ${info["Tire"]}</p>
      <h3>Recommended Upgrades:</h3>
      <ul>
        ${info.Upgrades.map(u => `<li>${u}</li>`).join("")}
      </ul>
    `;
  } else {
    resultDiv.innerHTML = `<p>Model not found. Please submit feedback!</p>`;
  }
});