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

  // ✅ 记录搜索到 Google Sheet
  console.log('尝试发送数据到 Google Sheet:', { model: model });

  // 创建通用的响应处理函数
  function handleResponse(res) {
    console.log('HTTP 状态码:', res.status);
    console.log('响应状态:', res.statusText);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json(); // 直接解析 JSON 响应
  }

  function handleError(err) {
    console.error('Google Sheet 提交失败:', err);
    // 显示错误消息给用户
    const errorDiv = document.createElement('div');
    errorDiv.textContent = `数据提交失败: ${err.message}`;
    errorDiv.style.color = '#ff4d4d';
    errorDiv.style.marginTop = '10px';
    resultDiv.appendChild(errorDiv);
  }
  const url = `https://script.google.com/macros/s/AKfycbznRydOfO09DGWDxFNm3wCg-eQwwa1k1Y6mc_6MdujdTwwF9Lk0D8Vn0ihf90b5uiab5g/exec?model=${encodeURIComponent(model)}`;
  fetch(url, {
    method: 'GET'
  })
  .then(handleResponse)
  .catch(handleError);
  console.log(url)
  /*
  注意：前端代码已更新为只使用GET方法，并使用新的Google Script URL。
  
  此URL格式为Google Apps Script的标准格式，使用URL参数传递model数据。
  服务器端需要确保正确实现了doGet函数来处理GET请求中的URL参数。
  */
});
