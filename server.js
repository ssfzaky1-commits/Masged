const express = require('express');
const app = express();

// السماح باستقبال البيانات بحجم كبير (لكي يستوعب بيانات المساجد والطلاب)
app.use(express.json({ limit: '10mb' }));

// قراءة الملفات الثابتة (مثل ملف index.html و الـ CSS الموجودة في نفس المجلد)
app.use(express.static(__dirname));

// متغير لتخزين أحدث بيانات التطبيق سحابياً
let cloudData = {
    supervisor: "",
    mosques: [],
    lastResetDate: ""
};

// 1. مسار الصفحة الرئيسية (يعرض ملف index.html مباشرة للمتصفح)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 2. مسار جلب البيانات سحابياً
app.get('/api/data', (req, res) => {
    res.json(cloudData);
});

// 3. مسار إرسال وتحديث المزامنة (عندما يضغط المشرف مزامنة)
app.post('/api/sync', (req, res) => {
    // السماح بالاتصالات (CORS) لحل أي مشاكل تقنية
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const incomingData = req.body;
    
    if (incomingData && incomingData.mosques) {
        cloudData = incomingData;
    }

    res.json({ 
        success: true, 
        message: "تمت المزامنة والدمج بنجاح", 
        data: cloudData 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});