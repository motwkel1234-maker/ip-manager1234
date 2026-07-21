// ============================================================
// نظام إدارة عناوين IP والأجهزة
// IP Device Management System
// ملف JavaScript شامل لجميع الصفحات
// ============================================================

// ============================================================
// 1. بيانات تسجيل الدخول الوهمية
// ============================================================
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'admin123';

// ============================================================
// 2. بيانات الأجهزة الوهمية (Mock Data)
// ============================================================
let devicesData = [
    {
        id: 1,
        deviceName: 'خادم الملفات الرئيسي',
        ipAddress: '192.168.1.10',
        macAddress: 'AA:BB:CC:DD:EE:01',
        deviceType: 'خادم',
        department: 'تقنية المعلومات',
        location: 'غرفة الخوادم',
        status: 'نشط'
    },
    {
        id: 2,
        deviceName: 'جهاز المطور أحمد',
        ipAddress: '192.168.1.25',
        macAddress: 'AA:BB:CC:DD:EE:02',
        deviceType: 'كمبيوتر',
        department: 'التطوير',
        location: 'طابق 2 - مكتب 205',
        status: 'نشط'
    },
    {
        id: 3,
        deviceName: 'طابعة الشبكة',
        ipAddress: '192.168.1.50',
        macAddress: 'AA:BB:CC:DD:EE:03',
        deviceType: 'طابعة',
        department: 'الدعم الفني',
        location: 'طابق 1 - غرفة الطباعة',
        status: 'غير نشط'
    },
    {
        id: 4,
        deviceName: 'جهاز الموارد البشرية',
        ipAddress: '192.168.1.30',
        macAddress: 'AA:BB:CC:DD:EE:04',
        deviceType: 'كمبيوتر',
        department: 'الموارد البشرية',
        location: 'طابق 3 - مكتب 301',
        status: 'نشط'
    },
    {
        id: 5,
        deviceName: 'موجه الشبكة الرئيسي',
        ipAddress: '192.168.1.1',
        macAddress: 'AA:BB:CC:DD:EE:05',
        deviceType: 'موجه',
        department: 'تقنية المعلومات',
        location: 'غرفة الخوادم',
        status: 'نشط'
    },
    {
        id: 6,
        deviceName: 'جهاز المحاسبة',
        ipAddress: '192.168.1.40',
        macAddress: 'AA:BB:CC:DD:EE:06',
        deviceType: 'كمبيوتر',
        department: 'المحاسبة',
        location: 'طابق 2 - مكتب 210',
        status: 'غير نشط'
    }
];

// ============================================================
// 3. دوال التعامل مع Local Storage
// ============================================================

// تحميل البيانات من Local Storage
function loadDevicesFromStorage() {
    const stored = localStorage.getItem('devicesData');
    if (stored) {
        try {
            devicesData = JSON.parse(stored);
            return devicesData;
        } catch (e) {
            console.error('خطأ في تحميل البيانات:', e);
        }
    }
    // إذا لم توجد بيانات في Local Storage، نستخدم البيانات الوهمية
    saveDevicesToStorage();
    return devicesData;
}

// حفظ البيانات في Local Storage
function saveDevicesToStorage() {
    localStorage.setItem('devicesData', JSON.stringify(devicesData));
}

// توليد معرف جديد
function generateId() {
    return Math.max(...devicesData.map(d => d.id), 0) + 1;
}

// ============================================================
// 4. دوال تسجيل الدخول
// ============================================================

// التحقق من حالة تسجيل الدخول
function checkLoginStatus() {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // إذا كان المستخدم مسجل دخول وليس في صفحة تسجيل الدخول، لا تفعل شيء
    if (loggedIn === 'true' && currentPage !== 'login.html') {
        return true;
    }
    
    // إذا كان المستخدم مسجل دخول وفي صفحة تسجيل الدخول، انتقل للرئيسية
    if (loggedIn === 'true' && currentPage === 'login.html') {
        window.location.href = 'index.html';
        return true;
    }
    
    // إذا لم يكن مسجل دخول وليس في صفحة تسجيل الدخول، انتقل لتسجيل الدخول
    if (loggedIn !== 'true' && currentPage !== 'login.html') {
        window.location.href = 'login.html';
        return false;
    }
    
    return false;
}

// معالجة تسجيل الدخول
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const messageDiv = document.getElementById('loginMessage');
    
    if (!username || !password) {
        showLoginMessage('⚠️ الرجاء ملء جميع الحقول. | Please fill all fields.', 'error');
        return;
    }
    
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        
        showLoginMessage('✅ تم تسجيل الدخول بنجاح! جاري التحويل... | Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showLoginMessage('❌ اسم المستخدم أو كلمة المرور غير صحيحة. | Invalid username or password.', 'error');
    }
}

// عرض رسائل تسجيل الدخول
function showLoginMessage(message, type) {
    const messageDiv = document.getElementById('loginMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = 'login-message ' + type;
    }
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}
window.logout = logout;

// ============================================================
// 5. دوال الصفحة الرئيسية (index.html)
// ============================================================

// تحديث الإحصائيات
function updateStats() {
    const total = devicesData.length;
    const active = devicesData.filter(d => d.status === 'نشط').length;
    const inactive = devicesData.filter(d => d.status === 'غير نشط').length;
    const departments = [...new Set(devicesData.map(d => d.department))].length;
    
    const totalEl = document.getElementById('totalDevices');
    const activeEl = document.getElementById('activeDevices');
    const inactiveEl = document.getElementById('inactiveDevices');
    const deptEl = document.getElementById('totalDepartments');
    
    if (totalEl) totalEl.textContent = total;
    if (activeEl) activeEl.textContent = active;
    if (inactiveEl) inactiveEl.textContent = inactive;
    if (deptEl) deptEl.textContent = departments;
}

function initHomePage() {
    loadDevicesFromStorage();
    updateStats();
}

// ============================================================
// 6. دوال صفحة عرض الأجهزة (devices.html)
// ============================================================

// عرض جميع الأجهزة على شكل بطاقات
function renderDevices(devices) {
    const container = document.getElementById('devicesGrid');
    if (!container) return;
    
    if (!devices || devices.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="grid-column: 1/-1; padding: 2rem;">
                <p style="color: #6a5a7a; font-size: 1.2rem;">📭 لا توجد أجهزة مسجلة</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = devices.map(device => `
        <div class="device-card">
            <span class="device-icon">${getDeviceIcon(device.deviceType)}</span>
            <h3>${device.deviceName}</h3>
            <p class="device-info">🌐 ${device.ipAddress}</p>
            <p class="device-info">📂 ${device.department}</p>
            <p class="device-info">📋 ${device.deviceType}</p>
            <span class="device-status ${device.status === 'نشط' ? 'active' : 'inactive'}">
                ${device.status === 'نشط' ? '🟢 نشط' : '🔴 غير نشط'}
            </span>
            <div class="card-actions">
                <button class="btn btn-primary btn-sm" onclick="showDeviceDetails(${device.id})">📋 تفاصيل</button>
            </div>
        </div>
    `).join('');
}

// الحصول على أيقونة الجهاز حسب النوع
function getDeviceIcon(type) {
    const icons = {
        'خادم': '🖥️',
        'كمبيوتر': '💻',
        'طابعة': '🖨️',
        'موجه': '📡',
        'سويتش': '🔀',
        'جدار ناري': '🛡️'
    };
    return icons[type] || '📱';
}

// عرض تفاصيل الجهاز في نافذة منبثقة
function showDeviceDetails(id) {
    const device = devicesData.find(d => d.id === id);
    if (!device) return;
    
    const modal = document.getElementById('deviceModal');
    const content = document.getElementById('modalBody');
    
    content.innerHTML = `
        <div class="detail-row">
            <span class="label">📱 اسم الجهاز | Device Name</span>
            <span class="value">${device.deviceName}</span>
        </div>
        <div class="detail-row">
            <span class="label">🌐 عنوان IP | IP Address</span>
            <span class="value">${device.ipAddress}</span>
        </div>
        <div class="detail-row">
            <span class="label">🔗 عنوان MAC | MAC Address</span>
            <span class="value">${device.macAddress}</span>
        </div>
        <div class="detail-row">
            <span class="label">📋 نوع الجهاز | Device Type</span>
            <span class="value">${device.deviceType}</span>
        </div>
        <div class="detail-row">
            <span class="label">🏢 القسم | Department</span>
            <span class="value">${device.department}</span>
        </div>
        <div class="detail-row">
            <span class="label">📍 الموقع | Location</span>
            <span class="value">${device.location}</span>
        </div>
        <div class="detail-row">
            <span class="label">📊 الحالة | Status</span>
            <span class="value">
                <span class="status-badge ${device.status === 'نشط' ? 'active' : 'inactive'}">
                    ${device.status === 'نشط' ? '🟢 نشط' : '🔴 غير نشط'}
                </span>
            </span>
        </div>
    `;
    
    modal.classList.add('open');
}

// إغلاق النافذة المنبثقة
function closeModal() {
    document.getElementById('deviceModal').classList.remove('open');
}

// ============================================================
// 7. دوال صفحة إدارة الأجهزة (manage.html)
// ============================================================

// عرض الأجهزة في جدول مع خيارات البحث
function renderManageTable(devices) {
    const container = document.getElementById('manageTableBody');
    if (!container) return;
    
    if (!devices || devices.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="8" class="text-center" style="padding: 2rem; color: #6a5a7a;">
                    📭 لا توجد أجهزة مسجلة
                </td>
            </tr>
        `;
        return;
    }
    
    container.innerHTML = devices.map(device => `
        <tr>
            <td>${device.id}</td>
            <td>${device.deviceName}</td>
            <td>🌐 ${device.ipAddress}</td>
            <td>${device.deviceType}</td>
            <td>${device.department}</td>
            <td>
                <span class="status-badge ${device.status === 'نشط' ? 'active' : 'inactive'}">
                    ${device.status === 'نشط' ? '🟢 نشط' : '🔴 غير نشط'}
                </span>
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-warning btn-sm" onclick="editDevice(${device.id})">✏️ تعديل</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteDevice(${device.id})">🗑️ حذف</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// البحث عن الأجهزة
function searchDevices() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const filtered = devicesData.filter(device => {
        return device.deviceName.toLowerCase().includes(query) ||
               device.ipAddress.includes(query) ||
               device.department.toLowerCase().includes(query);
    });
    renderManageTable(filtered);
}

// حذف جهاز
function deleteDevice(id) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا الجهاز؟')) return;
    
    devicesData = devicesData.filter(d => d.id !== id);
    saveDevicesToStorage();
    renderManageTable(devicesData);
    updateStats();
    alert('✅ تم حذف الجهاز بنجاح!');
}

// تعديل جهاز (فتح نموذج التعديل)
function editDevice(id) {
    const device = devicesData.find(d => d.id === id);
    if (!device) return;
    
    // ملء النموذج بالبيانات الحالية
    document.getElementById('editId').value = device.id;
    document.getElementById('editDeviceName').value = device.deviceName;
    document.getElementById('editIpAddress').value = device.ipAddress;
    document.getElementById('editMacAddress').value = device.macAddress;
    document.getElementById('editDeviceType').value = device.deviceType;
    document.getElementById('editDepartment').value = device.department;
    document.getElementById('editLocation').value = device.location;
    document.getElementById('editStatus').value = device.status;
    
    // عرض نموذج التعديل
    document.getElementById('editFormContainer').style.display = 'block';
    document.getElementById('editFormContainer').scrollIntoView({ behavior: 'smooth' });
}

// تحديث جهاز
function updateDevice(event) {
    event.preventDefault();
    
    const id = parseInt(document.getElementById('editId').value);
    const deviceName = document.getElementById('editDeviceName').value.trim();
    const ipAddress = document.getElementById('editIpAddress').value.trim();
    const macAddress = document.getElementById('editMacAddress').value.trim();
    const deviceType = document.getElementById('editDeviceType').value;
    const department = document.getElementById('editDepartment').value.trim();
    const location = document.getElementById('editLocation').value.trim();
    const status = document.getElementById('editStatus').value;
    
    // التحقق من صحة عنوان IP
    if (!validateIP(ipAddress)) {
        alert('⚠️ عنوان IP غير صحيح. الرجاء إدخال عنوان IP صحيح (مثال: 192.168.1.1)');
        return;
    }
    
    const index = devicesData.findIndex(d => d.id === id);
    if (index === -1) return;
    
    devicesData[index] = {
        ...devicesData[index],
        deviceName,
        ipAddress,
        macAddress,
        deviceType,
        department,
        location,
        status
    };
    
    saveDevicesToStorage();
    renderManageTable(devicesData);
    updateStats();
    
    // إخفاء نموذج التعديل
    document.getElementById('editFormContainer').style.display = 'none';
    alert('✅ تم تحديث الجهاز بنجاح!');
}

// ============================================================
// 8. دوال صفحة إضافة جهاز (add-device.html)
// ============================================================

// التحقق من صحة عنوان IP
function validateIP(ip) {
    const pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return pattern.test(ip);
}

// إضافة جهاز جديد
function addDevice(event) {
    event.preventDefault();
    
    const deviceName = document.getElementById('deviceName').value.trim();
    const ipAddress = document.getElementById('ipAddress').value.trim();
    const macAddress = document.getElementById('macAddress').value.trim();
    const deviceType = document.getElementById('deviceType').value;
    const department = document.getElementById('department').value.trim();
    const location = document.getElementById('location').value.trim();
    const status = document.getElementById('status').value;
    const messageDiv = document.getElementById('formMessage');
    
    // التحقق من الحقول الفارغة
    if (!deviceName || !ipAddress || !macAddress || !department || !location) {
        showFormMessage('⚠️ الرجاء ملء جميع الحقول.', 'error');
        return;
    }
    
    // التحقق من صحة عنوان IP
    if (!validateIP(ipAddress)) {
        showFormMessage('⚠️ عنوان IP غير صحيح. الرجاء إدخال عنوان IP صحيح (مثال: 192.168.1.1)', 'error');
        return;
    }
    
    // التحقق من عدم وجود عنوان IP مكرر
    if (devicesData.some(d => d.ipAddress === ipAddress)) {
        showFormMessage('⚠️ هذا العنوان IP موجود بالفعل. الرجاء استخدام عنوان مختلف.', 'error');
        return;
    }
    
    // إضافة الجهاز الجديد
    const newDevice = {
        id: generateId(),
        deviceName,
        ipAddress,
        macAddress,
        deviceType,
        department,
        location,
        status
    };
    
    devicesData.push(newDevice);
    saveDevicesToStorage();
    
    showFormMessage('✅ تم إضافة الجهاز بنجاح!', 'success');
    document.getElementById('addDeviceForm').reset();
    
    // تحديث الإحصائيات إذا كنا في الصفحة الرئيسية
    if (document.getElementById('totalDevices')) {
        updateStats();
    }
}

// عرض رسائل النموذج
function showFormMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = 'form-message ' + type;
    }
}

// ============================================================
// 9. دوال صفحة التواصل (contact.html)
// ============================================================

// معالجة نموذج التواصل
function handleContact(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    
    if (!name || !email || !phone || !message) {
        alert('⚠️ الرجاء ملء جميع الحقول.');
        return;
    }
    
    alert(`✅ تم إرسال رسالتك بنجاح!\n\nالاسم: ${name}\nالبريد: ${email}\nالجوال: ${phone}\nالرسالة: ${message}`);
    document.getElementById('contactForm').reset();
}

// ============================================================
// 10. دوال القائمة للجوال
// ============================================================

function initMobileMenu() {
    const toggleBtn = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (toggleBtn && navMenu) {
        toggleBtn.addEventListener('click', function() {
            navMenu.classList.toggle('open');
        });
        
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('open');
            });
        });
    }
}

// ============================================================
// 11. تهيئة الصفحات حسب الصفحة الحالية
// ============================================================

function initPage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // التحقق من حالة تسجيل الدخول
    checkLoginStatus();
    
    // تهيئة القائمة للجوال
    initMobileMenu();
    
    // تهيئة كل صفحة حسب اسمها
    switch(currentPage) {
        case 'index.html':
        case '':
            initHomePage();
            break;
            
        case 'devices.html':
            loadDevicesFromStorage();
            renderDevices(devicesData);
            break;
            
        case 'manage.html':
            loadDevicesFromStorage();
            renderManageTable(devicesData);
            break;
            
        case 'add-device.html':
            // تهيئة نموذج إضافة جهاز
            const form = document.getElementById('addDeviceForm');
            if (form) {
                form.addEventListener('submit', addDevice);
            }
            break;
            
        case 'contact.html':
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', handleContact);
            }
            break;
            
        case 'login.html':
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', handleLogin);
            }
            break;
    }
}

// ============================================================
// 12. تشغيل التهيئة عند تحميل الصفحة
// ============================================================

document.addEventListener('DOMContentLoaded', initPage);

// جعل الدوال العامة متاحة في الـ HTML
window.showDeviceDetails = showDeviceDetails;
window.closeModal = closeModal;
window.deleteDevice = deleteDevice;
window.editDevice = editDevice;
window.updateDevice = updateDevice;
window.searchDevices = searchDevices;
window.logout = logout;
