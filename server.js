const express = require('express');
const app = express();

// السماح باستقبال البيانات بحجم كبير نسبياً (لكي يستوعب بيانات المساجد والطلاب)
app.use(express.json({ limit: '10mb' }));

// متغير لتخزين أحدث بيانات التطبيق سحابياً
let cloudData = {
    supervisor: "",
    mosques: [],
    lastResetDate: ""
};

// 1. مسار جلب البيانات (عندما يضغط المشرف مزامنة ليسحب الجديد)
app.get('/api/data', (req, res) => {
    res.json(cloudData);
});

// 2. مسار إرسال وتحديث البيانات (عندما يرفع المشرف تعديلاته للسيرفر)
app.post('/api/sync', (req, res) => {
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
