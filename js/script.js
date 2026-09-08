const LIFF_ID = "2008429094-FMj09cl0";
let userProfile = null;

// 1. เรียก liff.init() ครั้งเดียวตอนโหลดเว็บ ไม่ต้อง re-init อีกเลยตลอดการใช้งาน
let liffInitPromise = (async () => {
    if (typeof liff === "undefined") {
        console.warn("ไม่พบ LIFF SDK - ระบบจะทำงานในรูปแบบ Standalone Web");
        return false;
    }
    try {
        await liff.init({ liffId: LIFF_ID });
        if (liff.isInClient() && liff.isLoggedIn()) {
            userProfile = await liff.getProfile();
        }
        return true;
    } catch (err) {
        console.error("LIFF Init Error:", err);
        return false;
    }
})();

const ALL_PAGES = ['page-list', 'page-detail', 'page-detail-tourism'];

function showPage(pageId) {
    ALL_PAGES.forEach(id => {
        document.getElementById(id).style.display = (id === pageId) 
            ? (id === 'page-home' ? 'flex' : 'flex') 
            : 'none';
    });
}

function showDetailPage() { showPage('page-detail'); }
function showTourismDetailPage() { showPage('page-detail-tourism'); }
function showListPage() { showPage('page-list'); }

// 3. ฟังก์ชันส่งข้อมูลการจอง
async function submitBooking(event) {
    if (event) event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const travelDateISO = document.getElementById("travelDateISO").value;
    const travelDateDisplay = document.getElementById("travelDate").value;
    const qty = document.getElementById("qty-input").value;
    const hotelMakkah = document.getElementById("hotelMakkah").value.trim() || '-';
    const hotelMadinah = document.getElementById("hotelMadinah").value.trim() || '-';
    const priceDisplay = document.getElementById("price-display").textContent.trim();
     // เคลียร์ข้อความเตือนเก่าก่อนเช็คใหม่ทุกครั้ง
    ["fullName", "phone", "travelDate", "hotelMakkah", "hotelMadinah"].forEach(id => {
    document.getElementById("err-" + id).textContent = "";
    });

    let hasError = false;
    if (!fullName) {
        document.getElementById("err-fullName").textContent = "กรุณากรอกชื่อ-สกุล";
        hasError = true;
    }
    if (!phone) {
        document.getElementById("err-phone").textContent = "กรุณากรอกเบอร์โทรศัพท์";
        hasError = true;
    }
    if (!travelDateISO) {
        document.getElementById("err-travelDate").textContent = "กรุณาเลือกวันเดินทาง";
        hasError = true;
    }
    if (!hotelMakkah || hotelMakkah === '-') {
        document.getElementById("err-hotelMakkah").textContent = "กรุณาเลือกโรงแรมมักกะฮ์";
        hasError = true;
    }
    if (!hotelMadinah || hotelMadinah === '-') {
        document.getElementById("err-hotelMadinah").textContent = "กรุณาเลือกโรงแรมมาดีนะฮ์";
        hasError = true;
    }

    if (hasError) return;

    const now = new Date();
const bookingId = 'UMR' + now.getFullYear().toString().slice(-2) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') + '-' +
    String(Math.floor(Math.random() * 9000) + 1000);

const bookingDate = now.toLocaleDateString('th-TH', {
    day: 'numeric', month: 'long', year: 'numeric'
});
const bookingTime = now.toLocaleTimeString('th-TH', {
    hour: '2-digit', minute: '2-digit'
});

const pricePerPerson = (parseInt(qty) > 0)
    ? Math.round(parseInt(priceDisplay.replace(/[^\d]/g, '')) / parseInt(qty)).toLocaleString()
    : '';

const messageText =
    `ข้อความการจองวีซ่าอุมเราะห์\n` +
    `เลขที่จอง: ${bookingId}\n` +
    `═══════════════════\n` +
    `ชื่อ-สกุล: ${fullName}\n` +
    `เบอร์โทร: ${phone}\n` +
    `วันเดินทาง: ${travelDateDisplay}\n` +
    `จำนวนผู้เดินทาง: ${qty} ท่าน\n` +
    `═══════════════════\n` +
    `ที่พักมักกะห์: ${hotelMakkah}\n` +
    `ที่พักมาดีนะห์: ${hotelMadinah}\n` +
    `═══════════════════\n` +
    `ราคาต่อท่าน: ${pricePerPerson} บาท\n` +
    `ราคารวมทั้งหมด: ${priceDisplay}\n` +
    `═══════════════════\n` +
    `เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยันการจองภายใน 24 ชม.`;

    const liffReady = await liffInitPromise;

    if (liffReady && liff.isInClient()) {
        if (!liff.isLoggedIn()) {
            liff.login();
            return;
        }
        try {
            await liff.sendMessages([{ type: "text", text: messageText }]);
            showSuccessPopup();
        } catch (err) {
            console.error("sendMessages Error:", err);
            showCopyPopup(messageText);
        }
    } else {
        showCopyPopup(messageText);
    }
}

async function submitBookingTourism(event) {
    if (event) event.preventDefault();

    const fullName = document.getElementById("fullNameTourism").value.trim();
    const phone = document.getElementById("phoneTourism").value.trim();
    const qty = document.getElementById("qty-input-tourism").value;
    const priceDisplay = document.getElementById("price-display-tourism").textContent.trim();

    ["fullNameTourism", "phoneTourism"].forEach(id => {
        document.getElementById("err-" + id).textContent = "";
    });

    let hasError = false;
    if (!fullName) {
        document.getElementById("err-fullNameTourism").textContent = "กรุณากรอกชื่อ-สกุล";
        hasError = true;
    }
    if (!phone) {
        document.getElementById("err-phoneTourism").textContent = "กรุณากรอกเบอร์โทรศัพท์";
        hasError = true;
    }
    if (hasError) return;

    const now = new Date();
    const bookingId = 'TUR' + now.getFullYear().toString().slice(-2) +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') + '-' +
        String(Math.floor(Math.random() * 9000) + 1000);

    const pricePerPerson = (parseInt(qty) > 0)
        ? Math.round(parseInt(priceDisplay.replace(/[^\d]/g, '')) / parseInt(qty)).toLocaleString()
        : '';
    
    const messageText =
        `ข้อความการจองวีซ่าท่องเที่ยว\n` +
        `เลขที่จอง: ${bookingId}\n` +
        `═══════════════════\n` +
        `ชื่อ-สกุล: ${fullName}\n` +
        `เบอร์โทร: ${phone}\n` +
        `จำนวนผู้เดินทาง: ${qty} ท่าน\n` +
        `═══════════════════\n` +
        `ราคาต่อท่าน: ${pricePerPerson} บาท\n` +
        `ราคารวมทั้งหมด: ${priceDisplay}\n` +
        `═══════════════════\n` +
        `เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยันการจองภายใน 24 ชม.`;

    const liffReady = await liffInitPromise;

    if (liffReady && liff.isInClient()) {
        if (!liff.isLoggedIn()) {
            liff.login();
            return;
        }
        try {
            await liff.sendMessages([{ type: "text", text: messageText }]);
            showSuccessPopup();
        } catch (err) {
            console.error("sendMessages Error:", err);
            showCopyPopup(messageText);
        }
    } else {
        showCopyPopup(messageText);
    }
}


// 4. ฟังก์ชันสร้าง Popup สำหรับคัดลอกข้อความ (รองรับการเปิดผ่าน Chrome/Safari)
function showCopyPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'message-popup';
    popup.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:9999;';

    popup.innerHTML = `
        <div style="background:#fff;padding:20px;border-radius:10px;max-width:90%;width:400px;text-align:center;">
            <h3 style="margin-top:0;">สำเร็จการกรอกข้อมูล</h3>
            <p style="font-size:13px;color:#666;">กรุณาคัดลอกข้อความด้านล่างเพื่อส่งไปยัง LINE Chat</p>
            <textarea readonly style="width:100%;height:180px;margin:10px 0;padding:8px;border:1px solid #ccc;border-radius:5px;resize:none;font-size:13px;">${message}</textarea>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:10px;">
                <button id="copyBtn" style="padding:10px 15px;background:#00b900;color:#fff;border:none;border-radius:5px;cursor:pointer;">คัดลอกข้อความ</button>
                <button onclick="this.closest('.message-popup').remove()" style="padding:10px 15px;background:#666;color:#fff;border:none;border-radius:5px;cursor:pointer;">ปิด</button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    document.getElementById('copyBtn').onclick = function () {
        navigator.clipboard.writeText(message).then(() => {
            this.textContent = '✅ คัดลอกแล้ว!';
            this.style.background = '#4caf50';
        }).catch(() => {
            alert('กรุณาคัดลอกข้อความด้วยตนเองจากช่องข้อความ');
        });
    };
}

function showSuccessPopup() {
    const popup = document.createElement('div');
    popup.className = 'message-popup';
    popup.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);display:flex;justify-content:center;align-items:center;z-index:9999;';

    popup.innerHTML = `
        <div style="background:#fff;padding:32px 28px 24px;border-radius:24px;max-width:85%;width:300px;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,0.15);">
            <img src="img/check-circle 1.svg" alt="สำเร็จ" style="width:72px;height:72px;margin-bottom:16px;">
            <div style="font-size:14px;color:#333;line-height:1.6;margin-bottom:20px;">
                ส่งข้อมูลเรียบร้อยแล้วค่ะ<br>
                เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด
            </div>
            <button id="successOkBtn" style="width:100%;padding:12px;border:1.5px solid #333;border-radius:24px;background:#fff;font-size:15px;font-weight:600;cursor:pointer;">ตกลง</button>
        </div>
    `;

    document.body.appendChild(popup);

    document.getElementById('successOkBtn').onclick = function () {
        popup.remove();
        if (typeof liff !== "undefined" && liff.isInClient && liff.isInClient()) {
            liff.closeWindow();
        }
    };
}

let makkahHotels = [];
let madinahHotels = [];
let hotelsLoaded = false;

async function loadHotelData() {
    if (hotelsLoaded) return; // โหลดแล้วไม่ต้องโหลดซ้ำ
    try {
        const res = await fetch('data/hotels.json');
        if (!res.ok) throw new Error('โหลดข้อมูลโรงแรมไม่สำเร็จ');
        const data = await res.json();
        makkahHotels = data.makkah;
        madinahHotels = data.madinah;
        hotelsLoaded = true;
    } catch (err) {
        console.error('Load hotels error:', err);
    }
}

const STAR_CATEGORIES = [
    { value: 'all', text: 'โรงแรมทุกระดับดาว', starCount: 0 },
    { value: '0', text: 'โรงแรมที่ยังไม่มีการกำหนดจำนวนดาว', starCount: 0 },
    { value: '1', text: 'โรงแรม', starCount: 1 },
    { value: '2', text: 'โรงแรม', starCount: 2 },
    { value: '3', text: 'โรงแรม', starCount: 3 },
    { value: '4', text: 'โรงแรม', starCount: 4 },
    { value: '5', text: 'โรงแรม', starCount: 5 }
];

function closeHotelPicker() {
    const existing = document.getElementById('hotelPickerModal');
    if (existing) existing.remove();
}

async function openHotelPicker(type) {
    await loadHotelData();
    renderCategoryStep(type);
}

function renderCategoryStep(type) {
    closeHotelPicker();
    const modal = document.createElement('div');
    modal.id = 'hotelPickerModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.45);display:flex;justify-content:center;align-items:center;z-index:9999;padding:20px;';

    const rows = STAR_CATEGORIES.map(item => {
        const starsHtml = item.starCount > 0
            ? Array(item.starCount).fill('<img src="img/star 1.svg" alt="star" class="hotel-picker-star">').join('')
            : '';
        return `<div class="hotel-picker-row hotel-picker-row-category" data-value="${item.value}">${item.text} ${starsHtml}</div>`;
    }).join('');;

    modal.innerHTML = `<div class="hotel-picker-card hotel-picker-category-card">${rows}</div>`;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeHotelPicker();
    });

    modal.querySelectorAll('.hotel-picker-row-category').forEach(row => {
        row.addEventListener('click', () => {
            renderSearchStep(type, row.getAttribute('data-value'));
        });
    });
}

function renderSearchStep(type, starValue) {
    closeHotelPicker();
    const hotelList = type === 'makkah' ? makkahHotels : madinahHotels;
    const filtered = starValue === 'all'
        ? hotelList
        : hotelList.filter(h => h.stars === parseInt(starValue));

    const modal = document.createElement('div');
    modal.id = 'hotelPickerModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.45);display:flex;justify-content:center;align-items:center;z-index:9999;padding:20px;';

    const cityLabel = type === 'makkah' ? 'มักกะฮ์' : 'มาดีนะฮ์';

    modal.innerHTML = `
        <div class="hotel-picker-card hotel-picker-search-card">
            <div class="hotel-picker-search-title">ค้นหาชื่อโรงแรม${cityLabel}</div>
            <div class="hotel-picker-search-box">
                <input type="text" id="hotelPickerSearchInput" placeholder="พิมพ์ชื่อโรงแรม">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <div id="hotelPickerResults" class="hotel-picker-results"></div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeHotelPicker();
    });

    function renderResults(list) {
        const container = document.getElementById('hotelPickerResults');
        if (list.length === 0) {
            container.innerHTML = '<div class="hotel-picker-empty">ไม่พบโรงแรมที่ค้นหา</div>';
            return;
        }
        container.innerHTML = list.map(h =>
            `<div class="hotel-picker-row" data-name="${h.name}">${h.name}</div>`
        ).join('');
        container.querySelectorAll('.hotel-picker-row').forEach(row => {
            row.addEventListener('click', () => {
                selectHotel(type, row.getAttribute('data-name'));
            });
        });
    }

    renderResults(filtered);

    document.getElementById('hotelPickerSearchInput').addEventListener('input', (e) => {
        const q = e.target.value.trim().toLowerCase();
        renderResults(filtered.filter(h => h.name.toLowerCase().includes(q)));
    });
}

function selectHotel(type, name) {
    const inputId = type === 'makkah' ? 'hotelMakkah' : 'hotelMadinah';
    document.getElementById(inputId).value = name;
    closeHotelPicker();
}

const THAI_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
                      'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const THAI_WEEKDAYS = ['อา','จ','อ','พ','พฤ','ศ','ส'];

let selectedTravelDate = null;
let dpViewDate = new Date();

function closeDatePicker() {
    const existing = document.getElementById('datePickerModal');
    if (existing) existing.remove();
}

function openDatePicker() {
    dpViewDate = selectedTravelDate ? new Date(selectedTravelDate) : new Date();
    renderDatePicker();
}

function renderDatePicker() {
    closeDatePicker();

    const year = dpViewDate.getFullYear();
    const month = dpViewDate.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(year, month, 1);
    const startWeekday = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    let cells = [];
    for (let i = startWeekday - 1; i >= 0; i--) {
        cells.push({ day: daysInPrevMonth - i, otherMonth: true });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, otherMonth: false, date: new Date(year, month, d) });
    }
    while (cells.length % 7 !== 0) {
        cells.push({ day: cells.length, otherMonth: true });
    }

    const weekdayHtml = THAI_WEEKDAYS.map(w => `<div class="dp-weekday">${w}</div>`).join('');

    const daysHtml = cells.map(c => {
        if (c.otherMonth) {
            return `<button type="button" class="dp-day dp-day--other-month" disabled>${c.day}</button>`;
        }
        const isPast = c.date < today;
        const isToday = c.date.getTime() === today.getTime();
        const isSelected = selectedTravelDate &&
            c.date.toDateString() === selectedTravelDate.toDateString();

        let cls = 'dp-day';
        if (isToday) cls += ' dp-day--today';
        if (isSelected) cls += ' dp-day--selected';
        if (isPast) cls += ' dp-day--disabled';

        return `<button type="button" class="${cls}" data-date="${c.date.toISOString()}" ${isPast ? 'disabled' : ''}>${c.day}</button>`;
    }).join('');

    const modal = document.createElement('div');
    modal.id = 'datePickerModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.45);display:flex;justify-content:center;align-items:center;z-index:9999;padding:20px;';

    modal.innerHTML = `
        <div class="date-picker-card">
            <div class="date-picker-header">
                <button type="button" class="date-picker-nav" id="dpPrevMonth"><i class="fa-solid fa-chevron-left"></i></button>
                <span class="dp-title">${THAI_MONTHS[month]} ${year + 543}</span>
                <button type="button" class="date-picker-nav" id="dpNextMonth"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="date-picker-weekdays">${weekdayHtml}</div>
            <div class="date-picker-grid">${daysHtml}</div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeDatePicker();
    });

    document.getElementById('dpPrevMonth').addEventListener('click', () => {
        dpViewDate = new Date(year, month - 1, 1);
        renderDatePicker();
    });
    document.getElementById('dpNextMonth').addEventListener('click', () => {
        dpViewDate = new Date(year, month + 1, 1);
        renderDatePicker();
    });

    modal.querySelectorAll('.dp-day[data-date]').forEach(btn => {
        btn.addEventListener('click', () => {
            selectTravelDate(new Date(btn.getAttribute('data-date')));
        });
    });
}

function selectTravelDate(date) {
    selectedTravelDate = date;
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    document.getElementById('travelDate').value = `${dd}/${mm}/${yyyy}`;
    document.getElementById('travelDateISO').value = `${yyyy}-${mm}-${dd}`;
    closeDatePicker();
}

    // 5. เมื่อ DOM พร้อม: ผูกปุ่ม, ระบบคำนวณราคา, ระบบล็อกการ์ดจนกว่าเพจจะโหลดครบ


        // 5. เมื่อ DOM พร้อม: ผูกปุ่ม, ระบบคำนวณราคา, ระบบล็อกการ์ดจนกว่าเพจจะโหลดครบ
    document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('umrah-link').addEventListener('click', showDetailPage);
    document.getElementById('back-link').addEventListener('click', (e) => {
        e.preventDefault();
        showListPage();
    });

    const tourismLink = document.getElementById('tourism-link');
    const backLinkTourism = document.getElementById('back-link-tourism');

    tourismLink.addEventListener('click', showTourismDetailPage);
    backLinkTourism.addEventListener('click', (e) => {
        e.preventDefault();
        showListPage();
    });


        // ----- ฟิลเตอร์โรงแรมตามดาว -----
    document.getElementById('makkahPickerTrigger').addEventListener('click', () => openHotelPicker('makkah'));
    document.getElementById('madinahPickerTrigger').addEventListener('click', () => openHotelPicker('madinah'));
    // ----- เปิดปฏิทินไทย (วันเดินทาง) -----
    const travelDateTrigger = document.getElementById('travelDatePickerTrigger');
    if (travelDateTrigger) {
        travelDateTrigger.addEventListener('click', () => openDatePicker());
    }

     // ----- แสดง % โหลดจากจำนวนรูปภาพจริง -----
    const overlay = document.getElementById('loading-overlay');
    const percentText = document.getElementById('loading-percent');
    const barFill = document.getElementById('loading-bar-fill');

    const images = Array.from(document.images); // นับรูปทั้งหมดในหน้า (ทั้งสอง section)
    const total = images.length;
    let loadedCount = 0;

    function updateProgress() {
        loadedCount++;
        const percent = total > 0 ? Math.round((loadedCount / total) * 100) : 100;
        percentText.textContent = percent + '%';
        barFill.style.width = percent + '%';

        if (loadedCount >= total) {
            overlay.classList.add('hidden');
        }
    }

    if (total === 0) {
        // ไม่มีรูปให้นับ ปลดล็อกทันที
        overlay.classList.add('hidden');
    } else {
        images.forEach((img) => {
            if (img.complete) {
                updateProgress();
            } else {
                img.addEventListener('load', updateProgress);
                img.addEventListener('error', updateProgress); // นับรวมด้วยแม้โหลดพลาด กันค้าง 100% ไม่ถึง
            }
        });
    }

    // ----- toggle ประเภทพาสปอร์ต (เฉพาะวีซ่าอุมเราะห์) -----
    const btnPassportThai = document.getElementById('btn-passport-thai');
    const btnPassportForeign = document.getElementById('btn-passport-foreign');
    const passportTypeInput = document.getElementById('passportType');
    const docWorkPermit = document.getElementById('doc-work-permit');   // << เพิ่มบรรทัดนี้

    if (btnPassportThai && btnPassportForeign && passportTypeInput) {
        btnPassportThai.addEventListener('click', () => {
            passportTypeInput.value = 'thai';
            btnPassportThai.classList.add('active');
            btnPassportForeign.classList.remove('active');
            if (docWorkPermit) docWorkPermit.style.display = 'none';   // << เพิ่ม ซ่อนเมื่อเลือกไทย
            updatePrice();
        });

        btnPassportForeign.addEventListener('click', () => {
            passportTypeInput.value = 'foreign';
            btnPassportForeign.classList.add('active');
            btnPassportThai.classList.remove('active');
            if (docWorkPermit) docWorkPermit.style.display = 'list-item';   // << เพิ่ม แสดงเมื่อเลือกต่างชาติ
            updatePrice();
        });
    }

    // ----- คำนวณราคาและระบบปุ่มบวกลบ -----
    const plusBtn = document.getElementById('btn-plus');
    const minusBtn = document.getElementById('btn-minus');
    const qtyInput = document.getElementById('qty-input');
    const priceDisplay = document.getElementById('price-display');
    const discountBadge = document.getElementById('discount-badge');

    function updatePrice() {
    let qty = parseInt(qtyInput.value) || 1;
    const passportType = passportTypeInput ? passportTypeInput.value : 'thai';
    let pricePerPerson;

    if (passportType === 'foreign') {
        // พาสปอร์ตต่างชาติ: ราคาคงที่ 8,500 ไม่มีส่วนลด
        pricePerPerson = 8500;
        if (discountBadge) {
            discountBadge.textContent = '';
        }
    } else {
        // พาสปอร์ตไทย: ใช้ราคา + ส่วนลดตามจำนวนคนแบบเดิม
        pricePerPerson = 6500;

        if (qty >= 6 && qty <= 9) {
            pricePerPerson = 5800;
            if (discountBadge) {
                discountBadge.textContent = '🎉 ประหยัด 10% (ลด 700 บาท/ท่าน)';
                discountBadge.style.color = '#2e7d32';
            }
        } else if (qty >= 10) {
            pricePerPerson = 5500;
            if (discountBadge) {
                discountBadge.textContent = '🔥 คุ้มที่สุด! ประหยัด 15% (ลด 1,000 บาท/ท่าน)';
                discountBadge.style.color = '#d32f2f';
            }
        } else {
            if (discountBadge) {
                discountBadge.textContent = '💡 เดินทาง 6 ท่านขึ้นไป รับส่วนลดสูงสุด 15%';
                discountBadge.style.color = '#666666';
            }
        }
    }

    let totalPrice = qty * pricePerPerson;
    if (priceDisplay) priceDisplay.textContent = totalPrice.toLocaleString() + ' บาท';
}

    if (plusBtn && minusBtn && qtyInput && priceDisplay) {
        plusBtn.addEventListener('click', () => {
            let qty = parseInt(qtyInput.value) || 1;
            qtyInput.value = qty + 1;
            updatePrice();
        });

        minusBtn.addEventListener('click', () => {
            let qty = parseInt(qtyInput.value) || 1;
            if (qty > 1) {
                qtyInput.value = qty - 1;
                updatePrice();
            }
        });

        qtyInput.addEventListener('input', () => {
            updatePrice();
        });
    }


    const plusBtnTourism = document.getElementById('btn-plus-tourism');
    const minusBtnTourism = document.getElementById('btn-minus-tourism');
    const qtyInputTourism = document.getElementById('qty-input-tourism');
    const priceDisplayTourism = document.getElementById('price-display-tourism');


    function updatePriceTourism() {
        let qty = parseInt(qtyInputTourism.value) || 1;
        let pricePerPerson = 5900; // ราคาฐานวีซ่าท่องเที่ยว
        let totalPrice = qty * pricePerPerson;
        if (priceDisplayTourism) priceDisplayTourism.textContent = totalPrice.toLocaleString() + ' บาท';
    }

    if (plusBtnTourism && minusBtnTourism && qtyInputTourism && priceDisplayTourism) {
        plusBtnTourism.addEventListener('click', () => {
            let qty = parseInt(qtyInputTourism.value) || 1;
            qtyInputTourism.value = qty + 1;
            updatePriceTourism();
        });

        minusBtnTourism.addEventListener('click', () => {
            let qty = parseInt(qtyInputTourism.value) || 1;
            if (qty > 1) {
                qtyInputTourism.value = qty - 1;
                updatePriceTourism();
            }
        });

        qtyInputTourism.addEventListener('input', () => {
            updatePriceTourism();
        });
    }

});


