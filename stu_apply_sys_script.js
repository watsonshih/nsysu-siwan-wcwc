// 產生課程編號
function generateCourseId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}`;
}

// DOM Elements
const tagInput = document.getElementById('tagInput');
const tagContainer = document.getElementById('tagContainer');
const addTagButton = document.getElementById('addTagButton');
const coverPreview = document.getElementById('coverPreview');
const coverPlaceholder = document.getElementById('coverPlaceholder');
const imagePreview = document.getElementById('imagePreview');
const imagePlaceholder = document.getElementById('imagePlaceholder');

// 初始化標籤集合
const tags = new Set();

// 初始化頁面
document.addEventListener('DOMContentLoaded', () => {
    // 初始化課程編號
    document.getElementById('courseId').value = generateCourseId();

    // 設置圖片預覽
    setupImagePreview('coverImageUrl', 'coverPreview', 'coverPlaceholder');
    setupImagePreview('imageUrl', 'imagePreview', 'imagePlaceholder');

    // 綁定課程大綱新增按鈕
    document.getElementById('addSyllabusRow').addEventListener('click', addSyllabusRow);

    // 綁定檔案讀取事件
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);

    // 初始化標籤輸入
    initializeTagInput();

    // 初始化按鈕事件
    initializeButtons();

    // 新增一個預設課程大綱
    addSyllabusRow();

    // 新增一個預設講師
    const lecturerSection = createLecturerSection();
    document.getElementById('lecturerContainer').appendChild(lecturerSection);

    // 設置年份自動填充
    document.getElementById('registrationYear').value = new Date().getFullYear();
    document.getElementById('registrationMonth').value = new Date().getUTCMonth() + 2;

    // 添加提示
    const tooltips = document.querySelectorAll('[data-tooltip]');
    if (tooltips.length > 0) {
        initializeTooltips(tooltips);
    }
});

// 標籤相關功能
function initializeTagInput() {
    function addTag() {
        const tag = tagInput.value.trim();
        if (tag) {
            if (!tags.has(tag)) {
                tags.add(tag);
                renderTags();
            }
            tagInput.value = '';
        }
    }

    tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    });

    addTagButton.addEventListener('click', () => {
        addTag();
    });
}

function renderTags() {
    tagContainer.innerHTML = '';
    tags.forEach(tag => {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.textContent = tag;
        chip.addEventListener('click', () => {
            tags.delete(tag);
            renderTags();
        });
        tagContainer.appendChild(chip);
    });
}

// 講師相關功能
function createLecturerSection() {
    const container = document.createElement('div');
    container.className = 'lecturer-container';

    container.innerHTML = `
        <div class="form-row">
            <div class="input-field">
                <label>姓名</label>
                <input type="text" class="lecturer-name form-input" placeholder="姓名">
            </div>
            <div class="input-field">
                <label>任職單位</label>
                <input type="text" class="lecturer-unit form-input" placeholder="單位">
            </div>
            <div class="input-field">
                <label>職稱</label>
                <input type="text" class="lecturer-title form-input" placeholder="職稱">
            </div>  
        </div>
        <div class="tag-section">
            <label for="field-label">講師專長標籤</label>
            <div class="tag-input-container">
                <div class="input-field" style="margin-bottom: 0;">
                <input type="text" class="expertise-input form-input" placeholder="按 Enter 或點擊 + 新增">
                </div>
                <button class="add-expertise-button btn-icon button primary-button">
                    <i class="material-icons">add</i>
                </button>
            </div>
            <div class="expertise-container"></div>
        </div>
        <div class="form-row">
            <div class="input-field full-width">
                <label class="field-label">講師介紹</label>
                <textarea class="lecturer-intro form-input" rows="3" placeholder="請輸入講師介紹"></textarea>
            </div>
        </div>
        <div class="form-row">
            <div class="input-field full-width">
                <label class="field-label">課程安排綱要</label>
                <textarea class="lecturer-course form-input" rows="3" placeholder="請簡述講者課程安排綱要"></textarea>
            </div>
        </div>
        <div class="form-row">
            <div class="input-field">
                <label>預計授課小時數</label>
                <input type="number" class="lecturer-hour form-input" placeholder="預計授課小時數">
            </div>
        </div>
        <div class="form-row">
            <div class="input-field full-width">
                <label>相關連結</label>
                <input type="url" class="lecturer-link form-input" placeholder="相關連結（非必要，限一個連結）">
            </div>
        </div>
        <div class="button-container">
          <button class="remove-lecturer btn-outline button primary-button">
                <i class="material-icons">delete</i>
                移除講師
          </button>
        </div>
    `;

    // 設置專長標籤的處理
    const expertiseInput = container.querySelector('.expertise-input');
    const expertiseContainer = container.querySelector('.expertise-container');
    const addExpertiseButton = container.querySelector('.add-expertise-button');
    const expertiseSet = new Set();

    function addExpertise() {
        const expertise = expertiseInput.value.trim();
        if (expertise) {
            if (!expertiseSet.has(expertise)) {
                expertiseSet.add(expertise);
                renderExpertise();
            }
            expertiseInput.value = '';
        }
    }

    expertiseInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addExpertise();
        }
    });

    addExpertiseButton.addEventListener('click', () => {
        addExpertise();
    });

    function renderExpertise() {
        expertiseContainer.innerHTML = '';
        expertiseSet.forEach(expertise => {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.textContent = expertise;
            chip.addEventListener('click', () => {
                expertiseSet.delete(expertise);
                renderExpertise();
            });
            expertiseContainer.appendChild(chip);
        });
    }

    container.querySelector('.remove-lecturer').addEventListener('click', () => {
        container.style.transition = 'opacity 0.3s, transform 0.3s';
        container.style.opacity = '0';
        container.style.transform = 'translateY(10px)';

        setTimeout(() => {
            container.remove();
        }, 300);
    });

    container.expertiseSet = expertiseSet;
    return container;
}

// 添加講師按鈕
document.getElementById('addLecturer').addEventListener('click', () => {
    const lecturerSection = createLecturerSection();

    // 添加淡入動畫
    lecturerSection.style.opacity = '0';
    lecturerSection.style.transform = 'translateY(10px)';

    document.getElementById('lecturerContainer').appendChild(lecturerSection);

    // 觸發重繪
    lecturerSection.offsetHeight;

    // 執行動畫
    lecturerSection.style.transition = 'all 0.5s';
    lecturerSection.style.opacity = '1';
    lecturerSection.style.transform = 'translateY(0)';
});

// 圖片預覽功能
function setupImagePreview(inputId, previewId, placeholderId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const placeholder = document.getElementById(placeholderId);

    // 初始化預覽
    updateImagePreview(input.value, preview, placeholder);

    // 監聽輸入變化
    input.addEventListener('input', () => {
        updateImagePreview(input.value, preview, placeholder);
    });

    // 處理圖片載入錯誤
    preview.addEventListener('error', () => {
        preview.style.display = 'none';
        placeholder.style.display = 'flex';
    });
}

function updateImagePreview(url, preview, placeholder) {
    const processedUrl = processGoogleDriveUrl(url);
    if (url) {
        preview.src = processedUrl;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
    } else {
        preview.style.display = 'none';
        placeholder.style.display = 'flex';
    }
}

// 處理 Google Drive 圖片網址
function processGoogleDriveUrl(url) {
    if (!url) return '';

    // 檢查是否為 Google Drive 網址
    const driveRegex = /drive\.google\.com\/file\/d\/(.*?)(?:\/|$|\?)/;
    const match = url.match(driveRegex);

    if (match && match[1]) {
        return `https://lh3.google.com/u/0/d/${match[1]}`;
    }

    return url;
}

// 修改提示訊息功能
function showMessage(type, message) {
    const snackbar = document.createElement('div');
    const snackbarcontainer = document.createElement('div');
    const icon = document.createElement('md-icon');
    const messageSpan = document.createElement('span');

    const courseForm_load = document.getElementById('courseForm');
    courseForm_load.className = 'unload loaded';

    snackbar.className = 'snackbar';
    snackbarcontainer.className = 'snackbar-container';
    messageSpan.className = 'snackbar-message';
    messageSpan.textContent = message;
    icon.slot = 'icon';

    if (type === 'success') {
        icon.textContent = 'check_circle';
        snackbar.style.setProperty('background', '#e8f5e9');
        snackbar.style.setProperty('color', '#2e7d32');
        icon.style.color = '#2e7d32';
    } else {
        icon.textContent = 'error';
        snackbar.style.setProperty('background', '#ffebee');
        snackbar.style.setProperty('color', '#d32f2f');
        icon.style.color = '#d32f2f';
    }

    snackbar.appendChild(snackbarcontainer);
    snackbarcontainer.appendChild(icon);
    snackbarcontainer.appendChild(messageSpan);
    document.body.appendChild(snackbar);

    // 顯示 snackbar
    snackbar.classList.add('show');

    // 移除
    setTimeout(() => {
        snackbar.classList.remove('show');
        setTimeout(() => {
            snackbar.remove();
        }, 600);
    }, 3000);
}


// 課程大綱相關功能
function addSyllabusRow() {
    const tbody = document.querySelector('#syllabusTable tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><div class="input-field"><label>上課時間及地點</label><textarea class="form-input" rows="4" placeholder="">年/月/日&#10;00:00~00:00&#10;地點</textarea></div></td>
        <td><div class="input-field"><label>講師</label><textarea class="form-input" rows="4" placeholder=""></textarea></div></td>
        <td><div class="input-field"><label>講題</label><textarea class="form-input" rows="4" placeholder=""></textarea></div></td>
        <td><div class="input-field"><label>課程學習重點</label><textarea class="form-input" rows="4" placeholder=""></textarea></div></td>
        <td>
            <div class="button-container">
                <button class="delete-row btn-icon button primary-button">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        </td>
    `;

    row.querySelector('.delete-row').addEventListener('click', () => {
        // 添加淡出動畫
        row.style.opacity = '0';
        row.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';

        setTimeout(() => {
            row.remove();
        }, 750);
    });

    // 添加淡入動畫
    row.style.opacity = '0';
    tbody.appendChild(row);

    // 觸發重繪
    row.offsetHeight;

    // 執行動畫
    row.style.transition = 'all 0.75s';
    row.style.opacity = '1';
}

// 獲取課程大綱數據
function getSyllabusData() {
    const rows = document.querySelectorAll('#syllabusTable tbody tr');
    return Array.from(rows).map(row => {
        const textareas = row.querySelectorAll('textarea');
        return {
            上課時間及地點: textareas[0].value,
            講師: textareas[1].value,
            講題: textareas[2].value,
            課程學習重點: textareas[3].value
        };
    });
}

// 獲取講師數據
function getLecturerData() {
    const containers = document.querySelectorAll('.lecturer-container');
    return Array.from(containers).map(container => {
        return {
            姓名: container.querySelector('.lecturer-name').value,
            單位: container.querySelector('.lecturer-unit').value,
            職稱: container.querySelector('.lecturer-title').value,
            專長: Array.from(container.expertiseSet || []),
            介紹: container.querySelector('.lecturer-intro').value,
            預計授課小時數: container.querySelector('.lecturer-hour').value || '',
            課程安排綱要: container.querySelector('.lecturer-course').value || '',
            相關連結: container.querySelector('.lecturer-link').value
        };
    });
}

// 處理換行符號
function handleLineBreaks(text, toJson = false) {
    if (toJson) {
        return text.replace(/\n/g, '\\n');
    }
    return text.replace(/\\n/g, '\n');
}

// 按鈕初始化
function initializeButtons() {
    // 儲存按鈕
    document.querySelectorAll('#saveButton').forEach(button => {
        button.addEventListener('click', saveCourseData);
    });

    // 讀取按鈕
    document.querySelectorAll('#loadButton').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
    });

    // 檔案上傳事件
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
}

// 處理檔案上傳
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            loadCourseData(data);
            showMessage('success', '讀取成功');
        } catch (error) {
            console.error('讀取失敗:', error);
            showMessage('error', '讀取失敗');
        }
    };
    reader.onerror = () => {
        showMessage('error', '讀取失敗');
    };
    reader.readAsText(file);
}

// 載入課程數據
function loadCourseData(data) {
    // 基本資訊
    document.getElementById('applyName').value = data.提案人 || '';
    document.getElementById('applyId').value = data.提案人學號 || '';
    document.getElementById('applyDepartment').value = data.提案人系級 || '';
    document.getElementById('applyPhone').value = data.提案人電話 || '';
    document.getElementById('applyMail').value = data.提案人Mail || '';
    document.getElementById('courseId').value = data.課程編號 || generateCourseId();
    document.getElementById('courseName').value = data.課程名稱 || '';
    document.getElementById('courseHours').value = data.每次上課時數 || '2';

    // 課程內容
    document.getElementById('motivation').value = handleLineBreaks(data.開課動機 || '', false);
    document.getElementById('objectives').value = handleLineBreaks(data.課程目標 || '', false);
    document.getElementById('expectedResults').value = handleLineBreaks(data.預期成果 || '', false);
    if (data.課程簡介) {
        document.getElementById('courseIntro').value = handleLineBreaks(data.課程簡介, false);
    }

    // 圖片
    document.getElementById('coverImageUrl').value = data.封面圖片網址 || '';
    document.getElementById('imageUrl').value = data.圖片網址 || '';
    updateImagePreview(data.封面圖片網址 || '', coverPreview, coverPlaceholder);
    updateImagePreview(data.圖片網址 || '', imagePreview, imagePlaceholder);
    document.getElementById('otherAttachmentUrl').value = data.其他附件網址 || '';

    // 報名期間
    if (data.報名期間) {
        document.getElementById('registrationYear').value = data.報名期間.年 || new Date().getFullYear();
        document.getElementById('registrationMonth').value = data.報名期間.月 || '';
    }

    // 課程標籤
    tags.clear();
    if (data.課程標籤 && Array.isArray(data.課程標籤)) {
        data.課程標籤.forEach(tag => tags.add(tag));
    }
    renderTags();

    // 講師資訊
    if (data.講師資訊 && Array.isArray(data.講師資訊)) {
        loadLecturerData(data.講師資訊);
    }

    // 課程大綱
    if (data.預計辦理場次數) {
        document.getElementById('courseCount').value = data.預計辦理場次數;
    }
    document.getElementById('coursePart').value = data.多節次活動 || '否';
    document.getElementById('courseDiet').value = data.提供餐點 || '否';

    if (data.課程大綱 && Array.isArray(data.課程大綱)) {
        loadSyllabusData(data.課程大綱);
    }
}

// 載入講師數據
function loadLecturerData(lecturers) {
    const container = document.getElementById('lecturerContainer');
    container.innerHTML = '';

    lecturers.forEach(lecturer => {
        const section = createLecturerSection();

        // 填入基本資料
        section.querySelector('.lecturer-name').value = lecturer.姓名 || '';
        section.querySelector('.lecturer-unit').value = lecturer.單位 || '';
        section.querySelector('.lecturer-title').value = lecturer.職稱 || '';
        section.querySelector('.lecturer-intro').value = lecturer.介紹 || '';

        if ('課程安排綱要' in lecturer) {
            section.querySelector('.lecturer-course').value = lecturer.課程安排綱要;
        }

        if ('預計授課小時數' in lecturer) {
            section.querySelector('.lecturer-hour').value = lecturer.預計授課小時數;
        }

        section.querySelector('.lecturer-link').value = lecturer.相關連結 || '';

        // 填入專長標籤
        const expertiseSet = section.expertiseSet;
        if (lecturer.專長 && Array.isArray(lecturer.專長)) {
            lecturer.專長.forEach(expertise => expertiseSet.add(expertise));
        }

        // 重新渲染專長標籤
        const expertiseContainer = section.querySelector('.expertise-container');
        expertiseContainer.innerHTML = '';
        expertiseSet.forEach(expertise => {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.textContent = expertise;
            chip.addEventListener('click', () => {
                expertiseSet.delete(expertise);
                chip.remove();
            });
            expertiseContainer.appendChild(chip);
        });

        container.appendChild(section);
    });
}

// 載入課程大綱
function loadSyllabusData(syllabusData) {
    const syllabusTable = document.querySelector('#syllabusTable tbody');
    syllabusTable.innerHTML = '';

    syllabusData.forEach(item => {
        addSyllabusRow();
        const row = syllabusTable.lastElementChild;
        const fields = row.querySelectorAll('textarea');
        fields[0].value = item.上課時間及地點 || '';
        fields[1].value = item.講師 || '';
        fields[2].value = item.講題 || '';
        fields[3].value = item.課程學習重點 || '';
    });
}

// 保存課程數據
function saveCourseData() {
    try {

        const courseData = {
            提案人: document.getElementById('applyName').value,
            提案人學號: document.getElementById('applyId').value,
            提案人系級: document.getElementById('applyDepartment').value,
            提案人電話: document.getElementById('applyPhone').value,
            提案人Mail: document.getElementById('applyMail').value,
            課程編號: document.getElementById('courseId').value,
            課程名稱: document.getElementById('courseName').value,
            開課動機: handleLineBreaks(document.getElementById('motivation').value, true),
            課程目標: handleLineBreaks(document.getElementById('objectives').value, true),
            預期成果: handleLineBreaks(document.getElementById('expectedResults').value, true),
            每次上課時數: document.getElementById('courseHours').value,
            封面圖片網址: document.getElementById('coverImageUrl').value,
            圖片網址: document.getElementById('imageUrl').value,
            講師資訊: getLecturerData(),
            課程標籤: Array.from(tags),
            報名期間: {
                年: document.getElementById('registrationYear').value,
                月: document.getElementById('registrationMonth').value
            },
            課程簡介: handleLineBreaks(document.getElementById('courseIntro').value, true),
            多節次活動: document.getElementById('coursePart').value,
            提供餐點: document.getElementById('courseDiet').value,
            預計辦理場次數: document.getElementById('courseCount').value,
            課程大綱: getSyllabusData(),
            其他附件網址: document.getElementById('otherAttachmentUrl').value,
        };

        const fileName = `募課提案_${courseData.課程名稱}_(SIWAN_WCWC).txt`;
        const jsonStr = JSON.stringify(courseData, null, 2);
        const blob = new Blob([jsonStr], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);

        showMessage('success', '下載成功');

        setTimeout(() => {
            if (confirm('申請單下載完成，是否前往送出提案？')) {
                window.open('https://bookho.nsysu.edu.tw/p/423-1367-4372.php', '_blank');
            }
        }, 1000);

    } catch (error) {
        console.error('下載失敗:', error);
        showMessage('error', '下載失敗');
    }
}