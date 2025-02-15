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
document.getElementById('courseId').innerText = generateCourseId();

// 標籤相關功能
const tagContainer = document.getElementById('tagContainer');
const tags = new Set();


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
            <h4 class="lecturer-name"></h4>
        </div>
        <div class="form-row">
            <p class="lecturer-unit title"></p>
            <p class="lecturer-title  title"></p>
        </div>
        <div class="lecturer-expertise">
            <div class="expertise-container"></div>
        </div>
        <p class="title">講師介紹</p>
        <div class="form-row">
            <p 
                class="lecturer-intro">
            </p>
        </div>
        <p class="title">講師課程安排綱要（預計授課 <span class="lecture-hour"></span> 小時）</p>
        <div class="form-row">
            <p 
                class="lecturer-course">
            </p>
        </div>
        <p class="title">講師相關連結</p>
        <div class="form-row">
            <p><a class="lecturer-link" href="" target="_blank"></a>
            </p>
        </div>
    `;

    // 設置專長標籤的處理
    const expertiseContainer = container.querySelector('.expertise-container');
    const expertiseSet = new Set();

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

    // 將專長集合附加到容器上，以便後續存取
    container.expertiseSet = expertiseSet;

    return container;
}

// 修改圖片預覽功能
function setupImagePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    // 初始化預覽
    if (input.innerText) {
        const processedUrl = processGoogleDriveUrl(input.innerText);
        preview.src = processedUrl;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }

    // 監聽輸入變化
    input.addEventListener('input', () => {
        const processedUrl = processGoogleDriveUrl(input.innerText);
        if (input.innerText) {
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

    // 3秒後移除
    setTimeout(() => {
        snackbar.classList.remove('show');
        setTimeout(() => {
            snackbar.remove();
        }, 150);
    }, 1500);
}

// 讀取JSON
document.getElementById('loadButton').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                loadCourseData(data);
                document.getElementById('loadButton').style.display = 'none';
                document.getElementById('downloadPDF').style.display = 'block';
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

// 修改課程大綱相關功能
function addSyllabusRow() {
    const tbody = document.querySelector('#syllabusTable tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><p type="textarea" rows="3" label="上課時間及地點"></p></td>
        <td><p type="textarea" rows="3" label="講師"></p></td>
        <td><p type="textarea" rows="3" label="講題"></p></td>
        <td><p type="textarea" rows="3" label="課程學習重點"></p></td>

    `;
    tbody.appendChild(row);
}

function getSyllabusData() {
    const rows = document.querySelectorAll('#syllabusTable tbody tr');
    return Array.from(rows).map(row => {
        const fields = row.querySelectorAll('p');
        return {
            上課時間及地點: fields[0].innerText,
            講師: fields[1].innerText,
            講題: fields[2].innerText,
            課程學習重點: fields[3].innerText
        };
    });
}

// 修改標籤輸入功能
function initializeChipInput(chipInput, container, itemSet) {
    chipInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && chipInput.innerText.trim()) {
            const value = chipInput.innerText.trim();
            if (!itemSet.has(value)) {
                itemSet.add(value);
                renderChips(container, itemSet);
            }
            chipInput.innerText = '';
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
        section.querySelector('.lecturer-name').innerText = lecturer.姓名;
        section.querySelector('.lecturer-unit').innerText = lecturer.單位;
        section.querySelector('.lecturer-title').innerText = lecturer.職稱;
        section.querySelector('.lecturer-intro').innerText = lecturer.介紹;
        section.querySelector('.lecture-hour').innerText = lecturer.預計授課小時數;
        section.querySelector('.lecturer-course').innerText = lecturer.課程安排綱要;
        section.querySelector('.lecturer-link').innerText = lecturer.相關連結;
        section.querySelector('.lecturer-link').href = lecturer.相關連結;

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
    // 更改網頁標題
    document.title = `${data.課程名稱} - 西灣我課提案申請審核單`;

    // 基本資訊
    document.getElementById('applyName').innerText = data.提案人;
    document.getElementById('applyId').innerText = data.提案人學號;
    document.getElementById('applyDepartment').innerText = data.提案人系級;
    document.getElementById('applyPhone').innerText = data.提案人電話;
    document.getElementById('applyMail').innerText = data.提案人Mail;
    document.getElementById('courseId').innerText = data.課程編號;
    document.getElementById('courseName').innerText = data.課程名稱;
    document.getElementById('courseCount').innerText = data.預計辦理場次數;
    document.getElementById('courseHours').innerText = data.每次上課時數;

    // 課程內容
    document.getElementById('motivation').innerText = handleLineBreaks(data.開課動機, false);
    document.getElementById('objectives').innerText = handleLineBreaks(data.課程目標, false);
    document.getElementById('expectedResults').innerText = handleLineBreaks(data.預期成果, false);
    document.getElementById('courseIntro').innerText = handleLineBreaks(data.課程簡介, false);

    // 圖片
    document.getElementById('coverImageUrl').innerText = data.封面圖片網址;
    document.getElementById('imageUrl').innerText = data.圖片網址;
    setupImagePreview('coverImageUrl', 'coverPreview');
    setupImagePreview('imageUrl', 'imagePreview');
    document.getElementById('otherAttachmentUrl').innerText = data.其他附件網址;

    // 報名期間
    document.getElementById('registrationYear').innerText = data.報名期間.年;
    document.getElementById('registrationMonth').innerText = data.報名期間.月;

    // 課程標籤
    tags.clear();
    data.課程標籤.forEach(tag => tags.add(tag));
    renderTags();

    // 講師資訊
    loadLecturerData(data.講師資訊);

    // 課程大綱
    document.getElementById('coursePart').innerText = data.多節次活動;
    document.getElementById('courseDiet').innerText = data.提供餐點;
    const syllabusTable = document.querySelector('#syllabusTable tbody');
    syllabusTable.innerHTML = '';
    data.課程大綱.forEach(item => {
        addSyllabusRow();
        const row = syllabusTable.lastElementChild;
        const fields = row.querySelectorAll('p');
        fields[0].innerText = item.上課時間及地點 || '';
        fields[1].innerText = item.講師 || '';
        fields[2].innerText = item.講題 || '';
        fields[3].innerText = item.課程學習重點 || '';
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 設置圖片預覽
    setupImagePreview('coverImageUrl', 'coverPreview');
    setupImagePreview('imageUrl', 'imagePreview');

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

// 新增下載 PDF 功能
document.getElementById('downloadPDF').addEventListener('click', () => {
    // 暫時隱藏不需要列印的元素
    const noPrintElements = document.querySelectorAll('.no-inPrint');
    const noPrintPDF = document.querySelectorAll('.no-inPrint-pdf');
    noPrintElements.forEach(el => {
        el.style.display = 'none';
    });
    noPrintPDF.forEach(el => {
        el.style.display = 'none';
    });

    // 使用 window.print()
    window.print();

    noPrintPDF.forEach(el => {
        el.style.display = '';
    });

});