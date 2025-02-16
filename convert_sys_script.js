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
    const convertNewlines = (text) => {
        return text ? text.replace(/\n/g, '<br>') : '';
    };

    let html = `<link href="/static/file/367/1367/img/4571/course_style.css" rel="stylesheet" />`;

    if (course["課程報名連結"]) {
        html += `
                <p style="text-align: center;"><a class="courseLink" href="${course["課程報名連結"]}" target="_blank">報名課程</a></p>
                `
    }

    // 課程基本資訊
    html += `<div class="coursedetail_grid">
        <div class="coursedetail_grid_4 course_info">
            <p class="info_title">課程狀態</p>
            <p class="info_text info_status">募課中</p>
        </div>
        <div class="coursedetail_grid_4 course_info">
            <p class="info_title">每次授課時數</p>
            <p class="info_text">${course["每次上課時數"]}</p>
        </div>
        <div class="coursedetail_grid_4 course_info">
            <p class="info_title">微學分獲得方式</p>
            <p class="info_text info_credit">${course["多節次活動"] === "否" ? "需參與所有場次" : "無須參與所有場次"}</p>
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

// 文字截斷函數
function truncateText(text) {
    if (!text) return '';
    if (text.length <= 48) return text;
    return text.substring(0, 48) + '...';
}

function displayResult(html, course) {
    // 創建結果顯示區域
    let resultDiv = document.getElementById('result');
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'result';
        document.body.appendChild(resultDiv);
    }

    courseTitleName = `${course["課程名稱"]}`
    const courseTitle = document.createElement('h2');
    courseTitle.textContent = courseTitleName;
    const courseTitleContainer = document.createElement('div');
    courseTitleContainer.className = 'code-title-container';

    const courseTitlecopyButton = document.createElement('md-filled-button');
    courseTitlecopyButton.textContent = '複製課程名稱';
    courseTitlecopyButton.onclick = () => {
        navigator.clipboard.writeText(courseTitleName).then(() => {
            const originalText = courseTitlecopyButton.textContent;
            courseTitlecopyButton.textContent = '複製成功！';
            setTimeout(() => {
                courseTitlecopyButton.textContent = originalText;
            }, 2000);
        });
    };

    courseTitleContainer.appendChild(courseTitle);
    courseTitleContainer.appendChild(courseTitlecopyButton);

    // 創建簡短程式碼區域
    const shortCodeTitle = document.createElement('h2');
    shortCodeTitle.textContent = '課程簡介程式碼';
    const shortCodeTitleContainer = document.createElement('div');
    shortCodeTitleContainer.className = 'code-title-container';


    const shortCodecopyButton = document.createElement('md-filled-button');
    shortCodecopyButton.textContent = '複製課程簡介程式碼';
    shortCodecopyButton.onclick = () => {
        navigator.clipboard.writeText(shortCodeHtml).then(() => {
            const originalText = shortCodecopyButton.textContent;
            shortCodecopyButton.textContent = '複製成功！';
            setTimeout(() => {
                shortCodecopyButton.textContent = originalText;
            }, 2000);
        });
    };

    const shortCodeDiv = document.createElement('div');
    const shortCodepre = document.createElement('pre');
    const shortCode = document.createElement('code');
    shortCodeHtml = `<p><strong>募課中</strong></p>\n<p>${truncateText(course["課程簡介"])}</p>`;
    shortCode.textContent = shortCodeHtml;
    shortCodepre.appendChild(shortCode);
    shortCodeDiv.appendChild(shortCodepre);
    shortCodeDiv.className = 'code';

    shortCodeTitleContainer.appendChild(shortCodeTitle);
    shortCodeTitleContainer.appendChild(shortCodecopyButton);


    // 創建預覽區域
    const previewDiv = document.createElement('div');
    previewDiv.innerHTML = html;
    previewDiv.className = 'preview';

    // 創建程式碼區域的標題和複製按鈕容器

    const codeTitleContainer = document.createElement('div');
    codeTitleContainer.className = 'code-title-container';

    const codeTitle = document.createElement('h2');
    codeTitle.textContent = '課程網頁程式碼';

    const copyButton = document.createElement('md-filled-button');
    copyButton.textContent = '複製課程網頁程式碼';
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
    downloadTitle.textContent = '圖片與附件（部分支援自動下載，如開啟新分頁請手動下載）';
    downloadContainer.appendChild(downloadTitle);

    // 檢查並創建下載按鈕
    if (course["封面圖片網址"]) {
        const coverButton = document.createElement('md-filled-button');
        coverButton.textContent = '封面圖片';
        coverButton.onclick = () => openAttachment(course["封面圖片網址"], '封面圖片');
        downloadContainer.appendChild(coverButton);
    }

    if (course["圖片網址"]) {
        const imageButton = document.createElement('md-filled-button');
        imageButton.textContent = '附加圖片';
        imageButton.onclick = () => openAttachment(course["圖片網址"], '圖片');
        downloadContainer.appendChild(imageButton);
    }

    if (course["其他附件網址"]) {
        const attachmentButton = document.createElement('md-filled-button');
        attachmentButton.textContent = '其他附件';
        attachmentButton.onclick = () => openAttachment(course["其他附件網址"], '其他附件');
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
    resultDiv.appendChild(courseTitleContainer);
    resultDiv.appendChild(shortCodeTitleContainer);
    resultDiv.appendChild(shortCodeDiv);
    resultDiv.appendChild(codeTitleContainer);
    resultDiv.appendChild(codeDiv);
    if (downloadContainer.children.length > 1) { // 如果有超過一個子元素（標題以外還有按鈕）
        resultDiv.appendChild(downloadContainer);
    }
    resultDiv.appendChild(document.createElement('h2')).textContent = '預覽 (請以西灣我課網頁呈現為準)';
    resultDiv.appendChild(previewDiv);
}

function processGoogleDriveUrl(url) {
    if (!url) return '';

    // 檢查是否為 Google Drive 網址
    const driveRegex = /drive\.google\.com\/file\/d\/(.*?)(?:\/|$|\?)/;
    const match = url.match(driveRegex);

    if (match && match[1]) {
        return {
            url: `https://drive.google.com/uc?export=download&id=${match[1]}`,
            isGoogleDrive: true
        };
    }

    return {
        url: url,
        isGoogleDrive: false
    };
}

// 下載的輔助函數
async function openAttachment(url) {
    try {
        const processedUrl = processGoogleDriveUrl(url);

        if (processedUrl.isGoogleDrive) {
            const downloadLink = document.createElement('a');
            downloadLink.href = processedUrl.url;
            downloadLink.download = '';
            downloadLink.style.display = 'none';
            downloadLink.target = '_blank';
            document.body.appendChild(downloadLink);

            downloadLink.click();

            setTimeout(() => {
                document.body.removeChild(downloadLink);
            }, 100);
            alert('檔案下載完成，請檢查下載資料夾。');
        } else {
            window.open(processedUrl.url, 'popup', 'width=800,height=600');
            alert('非 Google 雲端硬碟單一檔案，已開啟網頁，請手動下載。');
        }
    } catch (error) {
        console.error('處理檔案時發生錯誤:', error);
        alert('下載連結處理失敗，請稍後再試。');
    }
}