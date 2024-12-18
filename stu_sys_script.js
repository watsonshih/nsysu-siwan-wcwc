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

// 初始化課程編號
document.getElementById('courseId').value = generateCourseId();

// 標籤相關功能
const tagInput = document.getElementById('tagInput');
const tagContainer = document.getElementById('tagContainer');
const addTagButton = document.getElementById('addTagButton');
const tags = new Set();

// 新增處理標籤的函數
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

// Enter 鍵處理
tagInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // 防止表單提交
        addTag();
    }
});

// 按鈕點擊處理
addTagButton.addEventListener('click', () => {
    addTag();
});

function renderTags() {
    tagContainer.innerHTML = '';
    tags.forEach(tag => {
        const chip = document.createElement('md-filter-chip');
        chip.label = tag;
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
            <md-outlined-text-field class="lecturer-name" label="姓名"></md-outlined-text-field>
            <md-outlined-text-field class="lecturer-unit" label="單位"></md-outlined-text-field>
            <md-outlined-text-field class="lecturer-title" label="職稱"></md-outlined-text-field>
        </div>
        <div class="lecturer-expertise">
            <div class="form-row">
                <md-outlined-text-field class="expertise-input" label="專長標籤" supporting-text="至少一個，按下 Enter 或點擊 + 新增"></md-outlined-text-field>
                <md-icon-button class="add-expertise-button">
                    <md-icon>add_box</md-icon>
                </md-icon-button>
            </div>
            <div class="expertise-container"></div>
        </div>
        <div class="form-row">
            <md-outlined-text-field 
                class="lecturer-intro"
                label="介紹" 
                type="textarea" 
                rows="3">
            </md-outlined-text-field>
        </div>
        <div class="form-row">
            <md-outlined-text-field 
                class="lecturer-link"
                label="相關連結" 
                supporting-text="限一個連結"
                type="url">
            </md-outlined-text-field>
        </div>
        <div class="button-right">
            <md-outlined-button class="remove-lecturer">移除講師</md-outlined-button>
        </div>
    `;

    // 設置專長標籤的處理
    const expertiseInput = container.querySelector('.expertise-input');
    const expertiseContainer = container.querySelector('.expertise-container');
    const addExpertiseButton = container.querySelector('.add-expertise-button');
    const expertiseSet = new Set();

    // 新增處理專長標籤的函數
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

    // Enter 鍵處理
    expertiseInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 防止表單提交
            addExpertise();
        }
    });

    // 按鈕點擊處理
    addExpertiseButton.addEventListener('click', () => {
        addExpertise();
    });

    function renderExpertise() {
        expertiseContainer.innerHTML = '';
        expertiseSet.forEach(expertise => {
            const chip = document.createElement('md-filter-chip');
            chip.label = expertise;
            chip.addEventListener('click', () => {
                expertiseSet.delete(expertise);
                renderExpertise();
            });
            expertiseContainer.appendChild(chip);
        });
    }

    // 設置移除講師的處理
    container.querySelector('.remove-lecturer').addEventListener('click', () => {
        container.remove();
    });

    // 將專長集合附加到容器上，以便後續存取
    container.expertiseSet = expertiseSet;

    return container;
}

document.getElementById('addLecturer').addEventListener('click', () => {
    const lecturerSection = createLecturerSection();
    document.getElementById('lecturerContainer').appendChild(lecturerSection);
});

// 修改圖片預覽功能
function setupImagePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    // 初始化預覽
    if (input.value) {
        const processedUrl = processGoogleDriveUrl(input.value);
        preview.src = processedUrl;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }

    // 監聽輸入變化
    input.addEventListener('input', () => {
        const processedUrl = processGoogleDriveUrl(input.value);
        if (input.value) {
            preview.src = processedUrl;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    });

    // 處理圖片載入錯誤
    preview.addEventListener('error', () => {
        preview.style.display = 'none';
    });
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

// 修改日期處理
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// 修改提示訊息功能
function showMessage(type, message) {
    const snackbar = document.createElement('div');
    const snackbarcontainer = document.createElement('div');
    const icon = document.createElement('md-icon');
    const messageSpan = document.createElement('span');

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
        }, 150);
    }, 2500);
}

// 修改儲存功能
document.querySelectorAll('#saveButton').forEach(button => {
    button.addEventListener('click', () => {
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
                課程大綱: getSyllabusData(),
                其他附件網址: document.getElementById('otherAttachmentUrl').value,
            };

            const fileName = `募課提案_${courseData.課程名稱}_(SIWAN_WCWC).txt`;
            const jsonStr = JSON.stringify(courseData, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);

            showMessage('success', '下載成��');
        } catch (error) {
            console.error('下載失敗:', error);
            showMessage('error', '下載失敗');
        }
    });
});

// 讀取JSON
document.querySelectorAll('#loadButton').forEach(button => {
    button.addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
});

document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
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
});

// 處理換行符號
function handleLineBreaks(text, toJson = false) {
    if (toJson) {
        return text.replace(/\n/g, '\\n');
    }
    return text.replace(/\\n/g, '\n');
}

// 修改講師資料的獲取函數
function getLecturerData() {
    const containers = document.querySelectorAll('.lecturer-container');
    return Array.from(containers).map(container => {
        return {
            姓名: container.querySelector('.lecturer-name').value,
            單位: container.querySelector('.lecturer-unit').value,
            職稱: container.querySelector('.lecturer-title').value,
            專長: Array.from(container.expertiseSet || []),
            介紹: container.querySelector('.lecturer-intro').value,
            相關連結: container.querySelector('.lecturer-link').value
        };
    });
}

// 修改課程大綱相關功能
function addSyllabusRow() {
    const tbody = document.querySelector('#syllabusTable tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><md-outlined-text-field type="textarea" rows="3" label="上課時間及地點" value="年/月/日\r00:00~00:00\r地點"></md-outlined-text-field></td>
        <td><md-outlined-text-field type="textarea" rows="3" label="講師"></md-outlined-text-field></td>
        <td><md-outlined-text-field type="textarea" rows="3" label="講題"></md-outlined-text-field></td>
        <td><md-outlined-text-field type="textarea" rows="3" label="課程學習重點"></md-outlined-text-field></td>
        <td>
            <md-outlined-button class="delete-row">刪除</md-outlined-button>
        </td>
    `;

    row.querySelector('.delete-row').addEventListener('click', () => {
        row.remove();
    });

    tbody.appendChild(row);
}

function getSyllabusData() {
    const rows = document.querySelectorAll('#syllabusTable tbody tr');
    return Array.from(rows).map(row => {
        const fields = row.querySelectorAll('md-outlined-text-field');
        return {
            上課時間及地點: fields[0].value,
            講師: fields[1].value,
            講題: fields[2].value,
            課程學習重點: fields[3].value
        };
    });
}

// 修改標籤輸入功能
function initializeChipInput(chipInput, container, itemSet) {
    chipInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && chipInput.value.trim()) {
            const value = chipInput.value.trim();
            if (!itemSet.has(value)) {
                itemSet.add(value);
                renderChips(container, itemSet);
            }
            chipInput.value = '';
        }
    });
}

function renderChips(container, itemSet) {
    container.innerHTML = '';
    itemSet.forEach(item => {
        const chip = document.createElement('md-filter-chip');
        chip.label = item;
        chip.addEventListener('click', () => {
            itemSet.delete(item);
            renderChips(container, itemSet);
        });
        container.appendChild(chip);
    });
}

// 修改講師資料的載入函數
function loadLecturerData(lecturers) {
    const container = document.getElementById('lecturerContainer');
    container.innerHTML = '';

    lecturers.forEach(lecturer => {
        const section = createLecturerSection();

        // 填入基本資料
        section.querySelector('.lecturer-name').value = lecturer.姓名;
        section.querySelector('.lecturer-unit').value = lecturer.單位;
        section.querySelector('.lecturer-title').value = lecturer.職稱;
        section.querySelector('.lecturer-intro').value = lecturer.介紹;
        section.querySelector('.lecturer-link').value = lecturer.相關連結;

        // 填入專長標籤
        const expertiseSet = section.expertiseSet;
        lecturer.專長.forEach(expertise => expertiseSet.add(expertise));
        const expertiseContainer = section.querySelector('.expertise-container');
        expertiseContainer.innerHTML = '';
        expertiseSet.forEach(expertise => {
            const chip = document.createElement('md-filter-chip');
            chip.label = expertise;
            chip.addEventListener('click', () => {
                expertiseSet.delete(expertise);
                expertiseContainer.innerHTML = '';
                expertiseSet.forEach(exp => {
                    const newChip = document.createElement('md-filter-chip');
                    newChip.label = exp;
                    newChip.addEventListener('click', () => {
                        expertiseSet.delete(exp);
                        newChip.remove();
                    });
                    expertiseContainer.appendChild(newChip);
                });
            });
            expertiseContainer.appendChild(chip);
        });

        container.appendChild(section);
    });
}

// 完整的資料讀取功能
function loadCourseData(data) {
    // 基本資訊
    document.getElementById('applyName').value = data.提案人;
    document.getElementById('applyId').value = data.提案人學號;
    document.getElementById('applyDepartment').value = data.提案人系級;
    document.getElementById('applyPhone').value = data.提案人電話;
    document.getElementById('applyMail').value = data.提案人Mail;
    document.getElementById('courseId').value = data.課程編號;
    document.getElementById('courseName').value = data.課程名稱;
    document.getElementById('courseHours').value = data.每次上課時數;

    // 課程內容
    document.getElementById('motivation').value = handleLineBreaks(data.開課動機, false);
    document.getElementById('objectives').value = handleLineBreaks(data.課程目標, false);
    document.getElementById('expectedResults').value = handleLineBreaks(data.預期成果, false);
    document.getElementById('courseIntro').value = handleLineBreaks(data.課程簡介, false);

    // 圖片
    document.getElementById('coverImageUrl').value = data.封面圖片網址;
    document.getElementById('imageUrl').value = data.圖片網址;
    setupImagePreview('coverImageUrl', 'coverPreview');
    setupImagePreview('imageUrl', 'imagePreview');
    document.getElementById('otherAttachmentUrl').value = data.其他附件網址;

    // 報名期間
    document.getElementById('registrationYear').value = data.報名期間.年;
    document.getElementById('registrationMonth').value = data.報名期間.月;

    // 課程標籤
    tags.clear();
    data.課程標籤.forEach(tag => tags.add(tag));
    renderTags();

    // 講師資訊
    loadLecturerData(data.講師資訊);

    // 課程大綱
    document.getElementById('coursePart').value = data.多節次活動;
    document.getElementById('courseDiet').value = data.提供餐點;
    const syllabusTable = document.querySelector('#syllabusTable tbody');
    syllabusTable.innerHTML = '';
    data.課程大綱.forEach(item => {
        addSyllabusRow();
        const row = syllabusTable.lastElementChild;
        const fields = row.querySelectorAll('md-outlined-text-field');
        fields[0].value = item.上課時間及地點 || '';
        fields[1].value = item.講師 || '';
        fields[2].value = item.講題 || '';
        fields[3].value = item.課程學習重點 || '';
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 設置圖片預覽
    setupImagePreview('coverImageUrl', 'coverPreview');
    setupImagePreview('imageUrl', 'imagePreview');

    // 綁定課程大綱新增按鈕
    document.getElementById('addSyllabusRow').addEventListener('click', addSyllabusRow);

    // 更新檔案讀取事件
    document.getElementById('fileInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = JSON.parse(e.target.result);
                loadCourseData(data);
            };
            reader.readAsText(file);
        }
    });

    // 新增一個預設課程大綱
    addSyllabusRow();

    // 新增一個預設講師
    const lecturerSection = createLecturerSection();
    document.getElementById('lecturerContainer').appendChild(lecturerSection);

});