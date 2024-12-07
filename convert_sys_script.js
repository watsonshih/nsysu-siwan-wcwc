document.addEventListener('DOMContentLoaded', function () {
    const loadButton = document.getElementById('loadButton');
    const fileInput = document.getElementById('fileInput');
    let currentCourse = null;

    loadButton.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                currentCourse = JSON.parse(e.target.result);
                const htmlContent = generateHtmlContent(currentCourse);
                displayResult(htmlContent, currentCourse);
            } catch (error) {
                console.error('解析JSON時發生錯誤:', error);
            }
        };
        reader.readAsText(file);
    });
});

function generateHtmlContent(course) {
    // 創建一個輔助函數來處理換行符
    const convertNewlines = (text) => {
        return text ? text.replace(/\n/g, '<br>') : '';
    };

    let html = `<link href="/static/file/367/1367/img/4571/course_style.css" rel="stylesheet" />
    <div class="coursedetail_grid">`;

    // 課程基本資訊
    html += `
        <div class="coursedetail_grid_4 course_info">
            <p class="info_title">課程狀態</p>
            <p class="info_text info_status">課程已結束</p>
        </div>
        <div class="coursedetail_grid_4 course_info">
            <p class="info_title">每次授課時數</p>
            <p class="info_text">${course["每次上課時數"]}</p>
        </div>
        <div class="coursedetail_grid_4 course_info">
            <p class="info_title">微學分獲得方式</p>
            <p class="info_text info_credit">需參與所有場次</p>
        </div>`;

    // 課程標籤
    html += `
        <div class="coursedetail_grid_12 course_tags topic_tags">
            <ul>`;
    course["課程標籤"].forEach(tag => {
        html += `<li>${tag}</li>`;
    });
    html += `</ul></div>`;

    // 課程簡介
    html += `
        <div class="coursedetail_grid_12">
            <h3>課程簡介</h3>
            <div class="course_intro">
                <p>${convertNewlines(course["課程簡介"])}</p>
            </div>
        </div>`;

    // 講師資訊
    html += '<div class="coursedetail_grid_12"><h3>講師資訊</h3></div>';
    course["講師資訊"].forEach(lecturer => {
        html += `
        <div class="coursedetail_grid_6 course_speaker">
            <h6 class="speaker_name">${lecturer["姓名"]}</h6>
            <p class="speaker_info">`;

        if (lecturer["單位"]) {
            html += `<span class="speaker_company">${lecturer["單位"]}</span>`;
        }
        if (lecturer["職稱"]) {
            html += `<span class="speaker_title">${lecturer["職稱"]}</span>`;
        }

        html += `</p>
            <div class="course_tags speaker_tags">
            <ul>`;

        lecturer["專長"].forEach(tag => {
            html += `<li>${tag}</li>`;
        });

        html += `</ul></div>
        <p class="speaker_intro">${convertNewlines(lecturer["介紹"])}</p>`;

        if (lecturer["相關連結"]) {
            html += `<p class="speaker_link"><a class="lb speaker_link_url" href="${lecturer["相關連結"]}" target="_blank">講師相關連結</a></p>`;
        }
        html += "</div>";
    });

    // 課程大綱
    if (course["課程大綱"]) {
        html += `<div class="coursedetail_grid_12">
        <h3>課程大綱</h3>
        <table class="course_schedule">
            <tbody>
                <tr>
                    <th>上課時間及地點</th>
                    <th>講師</th>
                    <th>講題</th>
                    <th>課程學習重點</th>
                </tr>`;

        course["課程大綱"].forEach(outline => {
            html += `<tr>
            <td>${convertNewlines(outline["上課時間及地點"])}</td>
            <td>${outline["講師"]}</td>
            <td>${outline["講題"]}</td>
            <td>${convertNewlines(outline["課程學習重點"])}</td>
            </tr>`;
        });
        html += "</tbody></table></div></div>";
    } else {
        html += "</div>";
    }

    // 其他資訊
    html += `<p><a class="showPastInfo">顯示過去募課資料</a></p>
    <div class="coursedetail_grid course_PastInfo" style="display: none;">
        <div class="coursedetail_grid_12">
            <h3>開課動機</h3>
            <div class="course_motivation"><p>${convertNewlines(course["開課動機"])}</p></div>
        </div>
        <div class="coursedetail_grid_12">
            <h3>課程目標</h3>
            <div class="course_goal"><p>${convertNewlines(course["課程目標"])}</p></div>
        </div>
        <div class="coursedetail_grid_12">
            <h3>預期成果</h3>
            <div class="course_goal"><p>${convertNewlines(course["預期成果"])}</p></div>
        </div>
    </div>`;

    return html;
}

function displayResult(html, course) {
    // 創建結果顯示區域
    let resultDiv = document.getElementById('result');
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'result';
        document.body.appendChild(resultDiv);
    }

    // 創建預覽區域
    const previewDiv = document.createElement('div');
    previewDiv.innerHTML = html;
    previewDiv.className = 'preview';

    // 創建程式碼區域的標題和複製按鈕容器
    const codeTitleContainer = document.createElement('div');
    codeTitleContainer.className = 'code-title-container';

    const codeTitle = document.createElement('h2');
    codeTitle.textContent = 'HTML 程式碼';

    const copyButton = document.createElement('md-filled-button');
    copyButton.textContent = '複製程式碼';
    copyButton.onclick = () => {
        navigator.clipboard.writeText(html).then(() => {
            const originalText = copyButton.textContent;
            copyButton.textContent = '複製成功！';
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000);
        });
    };

    codeTitleContainer.appendChild(codeTitle);
    codeTitleContainer.appendChild(copyButton);

    // 創建下載區域
    const downloadContainer = document.createElement('div');
    downloadContainer.className = 'download-container';
    const downloadTitle = document.createElement('h2');
    downloadTitle.textContent = '下載區域';
    downloadContainer.appendChild(downloadTitle);

    // 檢查並創建下載按鈕
    if (course["封面圖片網址"]) {
        const coverButton = document.createElement('md-filled-button');
        coverButton.textContent = '下載封面圖片';
        coverButton.onclick = () => downloadImage(course["封面圖片網址"], '封面圖片');
        downloadContainer.appendChild(coverButton);
    }

    if (course["圖片網址"]) {
        const imageButton = document.createElement('md-filled-button');
        imageButton.textContent = '下載圖片';
        imageButton.onclick = () => downloadImage(course["圖片網址"], '圖片');
        downloadContainer.appendChild(imageButton);
    }

    if (course["其他附件網址"]) {
        const attachmentButton = document.createElement('md-filled-button');
        attachmentButton.textContent = '下載其他附件';
        attachmentButton.onclick = () => downloadImage(course["其他附件網址"], '其他附件');
        downloadContainer.appendChild(attachmentButton);
    }

    // 創建程式碼區域
    const codeDiv = document.createElement('div');
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = html;
    pre.appendChild(code);
    codeDiv.appendChild(pre);
    codeDiv.className = 'code';

    // 清空並添加新內容
    resultDiv.innerHTML = '';
    resultDiv.appendChild(codeTitleContainer);
    resultDiv.appendChild(codeDiv);
    if (downloadContainer.children.length > 1) { // 如果有超過一個子元素（標題以外還有按鈕）
        resultDiv.appendChild(downloadContainer);
    }
    resultDiv.appendChild(document.createElement('h2')).textContent = '預覽';
    resultDiv.appendChild(previewDiv);
}

// 下載圖片的輔助函數
async function downloadImage(url, filename) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const extension = url.split('.').pop(); // 取得副檔名

        // 創建下載連結
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.${extension}`;

        // 觸發下載
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 釋放 URL 物件
        window.URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error('下載圖片時發生錯誤:', error);
        alert('下載失敗，請稍後再試');
    }
}
