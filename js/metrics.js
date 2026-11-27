export const METRICS = {
  // ── Lipid profile ───────────────────────────────────────────────
  ldl: {
    group: 'lipid',
    label: { th: 'LDL (คอเลสเตอรอลตัวร้าย)', lo: 'LDL', en: 'LDL Cholesterol' },
    short: 'LDL',
    unit: 'mg/dL',
    direction: 'low-is-good',
    bands: [
      { max: 100, level: 'good', label: { th: 'ดีมาก', lo: 'ດີຫຼາຍ', en: 'Optimal' } },
      { max: 129, level: 'ok', label: { th: 'ปกติ', lo: 'ປົກກະຕິ', en: 'Near optimal' } },
      { max: 159, level: 'warn', label: { th: 'ค่อนข้างสูง', lo: 'ຄ່ອນຂ້າງສູງ', en: 'Borderline high' } },
      { max: 189, level: 'bad', label: { th: 'สูง', lo: 'ສູງ', en: 'High' } },
      { max: Infinity, level: 'critical', label: { th: 'สูงมาก', lo: 'ສູງຫຼາຍ', en: 'Very high' } }
    ]
  },
  hdl: {
    group: 'lipid',
    label: { th: 'HDL (คอเลสเตอรอลตัวดี)', lo: 'HDL', en: 'HDL Cholesterol' },
    short: 'HDL',
    unit: 'mg/dL',
    direction: 'high-is-good',
    bands: [
      { max: 39, level: 'bad', label: { th: 'ต่ำ', lo: 'ຕ່ຳ', en: 'Low' } },
      { max: 49, level: 'warn', label: { th: 'ค่อนข้างต่ำ', lo: 'ຄ່ອນຂ້າງຕ່ຳ', en: 'Below target' } },
      { max: 59, level: 'ok', label: { th: 'พอใช้', lo: 'ພໍໃຊ້', en: 'Acceptable' } },
      { max: Infinity, level: 'good', label: { th: 'ดี', lo: 'ດີ', en: 'Good' } }
    ]
  },
  tgl: {
    group: 'lipid',
    label: { th: 'ไตรกลีเซอไรด์ (TGL)', lo: 'TGL', en: 'Triglycerides' },
    short: 'TGL',
    unit: 'mg/dL',
    direction: 'low-is-good',
    bands: [
      { max: 149, level: 'good', label: { th: 'ปกติ', lo: 'ປົກກະຕິ', en: 'Normal' } },
      { max: 199, level: 'warn', label: { th: 'ค่อนข้างสูง', lo: 'ຄ່ອນຂ້າງສູງ', en: 'Borderline high' } },
      { max: 499, level: 'bad', label: { th: 'สูง', lo: 'ສູງ', en: 'High' } },
      { max: Infinity, level: 'critical', label: { th: 'สูงมาก', lo: 'ສູງຫຼາຍ', en: 'Very high' } }
    ]
  },
  tcho: {
    group: 'lipid',
    label: { th: 'คอเลสเตอรอลรวม', lo: 'ໂຄເລສະເຕີຣອນລວມ', en: 'Total Cholesterol' },
    short: 'Total',
    unit: 'mg/dL',
    direction: 'low-is-good',
    bands: [
      { max: 199, level: 'good', label: { th: 'ปกติ', lo: 'ປົກກະຕິ', en: 'Desirable' } },
      { max: 239, level: 'warn', label: { th: 'ค่อนข้างสูง', lo: 'ຄ່ອນຂ້າງສູງ', en: 'Borderline high' } },
      { max: Infinity, level: 'bad', label: { th: 'สูง', lo: 'ສູງ', en: 'High' } }
    ]
  },

  // ── Diabetes / blood sugar ──────────────────────────────────────
  hba1c: {
    group: 'diabetes',
    label: { th: 'HbA1c (น้ำตาลสะสม 3 เดือน)', lo: 'HbA1c', en: 'HbA1c' },
    short: 'HbA1c',
    unit: '%',
    direction: 'low-is-good',
    bands: [
      { max: 5.6, level: 'good', label: { th: 'ปกติ', lo: 'ປົກກະຕິ', en: 'Normal' } },
      { max: 6.4, level: 'warn', label: { th: 'ระยะเสี่ยงเบาหวาน', lo: 'ຄວາມສ່ຽງ', en: 'Prediabetes' } },
      { max: 7.9, level: 'bad', label: { th: 'เบาหวาน', lo: 'ເປັນເບົາຫວານ', en: 'Diabetes' } },
      { max: Infinity, level: 'critical', label: { th: 'ควบคุมไม่ได้', lo: 'ຄວບຄຸມບໍ່ໄດ້', en: 'Poorly controlled' } }
    ]
  },
  glucose_fasting: {
    group: 'diabetes',
    label: { th: 'น้ำตาลในเลือด (อดอาหาร)', lo: 'ນ້ຳຕານໃນເລືອດ', en: 'Fasting Glucose' },
    short: 'FPG',
    unit: 'mg/dL',
    direction: 'low-is-good',
    bands: [
      { max: 99, level: 'good', label: { th: 'ปกติ', lo: 'ປົກກະຕິ', en: 'Normal' } },
      { max: 125, level: 'warn', label: { th: 'ระยะเสี่ยง', lo: 'ຄວາມສ່ຽງ', en: 'Prediabetes' } },
      { max: Infinity, level: 'bad', label: { th: 'สูง', lo: 'ສູງ', en: 'Diabetes range' } }
    ]
  },
  glucose_random: {
    group: 'diabetes',
    label: { th: 'น้ำตาลในเลือด (ไม่อดอาหาร)', lo: 'ນ້ຳຕານ (ບໍ່ອົດ)', en: 'Random Glucose' },
    short: 'RBG',
    unit: 'mg/dL',
    direction: 'low-is-good',
    bands: [
      { max: 139, level: 'good', label: { th: 'ปกติ', lo: 'ປົກກະຕິ', en: 'Normal' } },
      { max: 199, level: 'warn', label: { th: 'ค่อนข้างสูง', lo: 'ຄ່ອນຂ້າງສູງ', en: 'Elevated' } },
      { max: Infinity, level: 'bad', label: { th: 'สูง', lo: 'ສູງ', en: 'High' } }
    ]
  },

  // ── Kidney ──────────────────────────────────────────────────────
  creatinine: {
    group: 'kidney',
    label: { th: 'ครีอะตินิน (การทำงานของไต)', lo: 'ຄຣີອາຕີນີນ', en: 'Creatinine' },
    short: 'Cr',
    unit: 'mg/dL',
    direction: 'low-is-good',
    bands: [
      { max: 1.0, level: 'good', label: { th: 'ปกติ', lo: 'ປົກກະຕິ', en: 'Normal' } },
      { max: 1.3, level: 'warn', label: { th: 'เริ่มสูง', lo: 'ເລີ່ມສູງ', en: 'Mildly elevated' } },
      { max: Infinity, level: 'bad', label: { th: 'สูง', lo: 'ສູງ', en: 'High' } }
    ]
  },
  egfr: {
    group: 'kidney',
    label: { th: 'eGFR (อัตรากรองของไต)', lo: 'eGFR', en: 'eGFR' },
    short: 'eGFR',
    unit: 'mL/min/1.73m²',
    direction: 'high-is-good',
    bands: [
      { max: 59, level: 'bad', label: { th: 'ต่ำ', lo: 'ຕ່ຳ', en: 'Low' } },
      { max: 89, level: 'warn', label: { th: 'ค่อนข้างต่ำ', lo: 'ຄ່ອນຂ້າງຕ່ຳ', en: 'Mildly reduced' } },
      { max: Infinity, level: 'good', label: { th: 'ปกติ', lo: 'ປົກກະຕິ', en: 'Normal' } }
    ]
  },

  // ── Liver ───────────────────────────────────────────────────────
  ast: {
    group: 'liver',
    label: { th: 'AST (เอนไซม์ตับ)', lo: 'AST', en: 'AST' },
    short: 'AST',
    unit: 'U/L',
    direction: 'low-is-good',
    bands: [
      { max: 30, level: 'good', label: { th: 'ปกติ', lo: 'ປົກກະຕິ', en: 'Normal' } },
      { max: 50, level: 'warn', label: { th: 'เริ่มสูง', lo: 'ເລີ່ມສູງ', en: 'Mildly high' } },
      { max: Infinity, level: 'bad', label: { th: 'สูง', lo: 'ສູງ', en: 'High' } }
    ]
  },
  alt: {
    group: 'liver',
    label: { th: 'ALT (เอนไซม์ตับ)', lo: 'ALT', en: 'ALT' },
    short: 'ALT',
    unit: 'U/L',
    direction: 'low-is-good',
    bands: [
      { max: 30, level: 'good', label: { th: 'ปกติ', lo: 'ປົກກະຕິ', en: 'Normal' } },
      { max: 50, level: 'warn', label: { th: 'เริ่มสูง', lo: 'ເລີ່ມສູງ', en: 'Mildly high' } },
      { max: Infinity, level: 'bad', label: { th: 'สูง', lo: 'ສູງ', en: 'High' } }
    ]
  },

  // ── Blood pressure & body ───────────────────────────────────────
  sbp: {
    group: 'vitals',
    label: { th: 'ความดันตัวบน (SBP)', lo: 'ຄວາມດັນເທິງ', en: 'Systolic BP' },
    short: 'SBP',
    unit: 'mmHg',
    direction: 'low-is-good',
    bands: [
      { max: 119, level: 'good', label: { th: 'ปกติ', lo: 'ປົກກະຕິ', en: 'Normal' } },
      { max: 129, level: 'warn', label: { th: 'เริ่มสูง', lo: 'ເລີ່ມສູງ', en: 'Elevated' } },
      { max: 139, level: 'bad', label: { th: 'สูง', lo: 'ສູງ', en: 'Stage 1' } },
      { max: Infinity, level: 'critical', label: { th: 'สูงมาก', lo: 'ສູງຫຼາຍ', en: 'Stage 2' } }
    ]
  },
  dbp: {
    group: 'vitals',
    label: { th: 'ความดันตัวล่าง (DBP)', lo: 'ຄວາມດັນລຸ່ມ', en: 'Diastolic BP' },
    short: 'DBP',
    unit: 'mmHg',
    direction: 'low-is-good',
    bands: [
      { max: 79, level: 'good', label: { th: 'ปกติ', lo: 'ປົກກະຕິ', en: 'Normal' } },
      { max: 89, level: 'bad', label: { th: 'สูง', lo: 'ສູງ', en: 'Stage 1' } },
      { max: Infinity, level: 'critical', label: { th: 'สูงมาก', lo: 'ສູງຫຼາຍ', en: 'Stage 2' } }
    ]
  },
  weight: {
    group: 'body',
    label: { th: 'น้ำหนัก', lo: 'ນ້ຳໜັກ', en: 'Weight' },
    short: 'Weight',
    unit: 'kg',
    direction: 'range',
    bands: [{ max: Infinity, level: 'neutral', label: { th: '', lo: '', en: '' } }]
  },
  bmi: {
    group: 'body',
    label: { th: 'ดัชนีมวลกาย (BMI)', lo: 'BMI', en: 'BMI' },
    short: 'BMI',
    unit: 'kg/m²',
    direction: 'range',
    // Asian cut-offs (WHO 2004): 23 = overweight risk starts, 25 = obese
    bands: [
      { max: 18.4, level: 'warn', label: { th: 'ต่ำกว่าเกณฑ์', lo: 'ຕ່ຳກວ່າເກນ', en: 'Underweight' } },
      { max: 22.9, level: 'good', label: { th: 'ปกติ', lo: 'ປົກກະຕິ', en: 'Normal' } },
      { max: 24.9, level: 'warn', label: { th: 'น้ำหนักเกิน', lo: 'ນ້ຳໜັກເກີນ', en: 'Overweight' } },
      { max: 29.9, level: 'bad', label: { th: 'อ้วน', lo: 'ອ້ວນ', en: 'Obese I' } },
      { max: Infinity, level: 'critical', label: { th: 'อ้วนมาก', lo: 'ອ້ວນຫຼາຍ', en: 'Obese II' } }
    ]
  },
  waist: {
    group: 'body',
    label: { th: 'รอบเอว', lo: 'ຮອບແອວ', en: 'Waist' },
    short: 'Waist',
    unit: 'cm',
    direction: 'low-is-good',
    bands: [
      { max: 79, level: 'good', label: { th: 'ปกติ', lo: 'ປົກກະຕິ', en: 'Normal' } },
      { max: 88, level: 'warn', label: { th: 'ควรระวัง', lo: 'ຄວນລະວັງ', en: 'Watch' } },
      { max: Infinity, level: 'bad', label: { th: 'อ้วนลงพุง', lo: 'ອ້ວນລົງພຸງ', en: 'Abdominal obesity' } }
    ]
  },
  urate: {
    group: 'other',
    label: { th: 'กรดยูริก (เก๊าท์)', lo: 'ອູຣິກ', en: 'Uric Acid' },
    short: 'UA',
    unit: 'mg/dL',
    direction: 'low-is-good',
    bands: [
      { max: 5.5, level: 'good', label: { th: 'ปกติ', lo: 'ປົກກະຕິ', en: 'Normal' } },
      { max: 7.0, level: 'warn', label: { th: 'ค่อนข้างสูง', lo: 'ຄ່ອນຂ້າງສູງ', en: 'Elevated' } },
      { max: Infinity, level: 'bad', label: { th: 'สูง', lo: 'ສູງ', en: 'High' } }
    ]
  },
  hemoglobin: {
    group: 'other',
    label: { th: 'ฮีโมโกลบิน (เลือดจาง?)', lo: 'ຮີໂມໂກຼບິນ', en: 'Hemoglobin' },
    short: 'Hb',
    unit: 'g/dL',
    direction: 'range',
    bands: [
      { max: 11.9, level: 'warn', label: { th: 'ต่ำ (เลือดจาง)', lo: 'ຕ່ຳ', en: 'Low' } },
      { max: 16.0, level: 'good', label: { th: 'ปกติ', lo: 'ປົກກະຕິ', en: 'Normal' } },
      { max: Infinity, level: 'warn', label: { th: 'สูง', lo: 'ສູງ', en: 'High' } }
    ]
  }
};

export const GROUPS = {
  lipid: { th: 'ไขมันในเลือด', lo: 'ໄຂມັນໃນເລືອດ', en: 'Lipid Profile' },
  diabetes: { th: 'เบาหวาน / น้ำตาลในเลือด', lo: 'ເບົາຫວານ', en: 'Diabetes' },
  kidney: { th: 'ไต', lo: 'ໝາກໄຂ່ຫຼັງ', en: 'Kidney' },
  liver: { th: 'ตับ', lo: 'ຕັບ', en: 'Liver' },
  vitals: { th: 'ความดัน', lo: 'ຄວາມດັນ', en: 'Blood Pressure' },
  body: { th: 'ร่างกาย', lo: 'ຮ່າງກາຍ', en: 'Body' },
  other: { th: 'อื่น ๆ', lo: 'ອື່ນໆ', en: 'Other' }
};

export function classify(metricKey, value) {
  const m = METRICS[metricKey];
  if (!m || value === null || value === undefined) return null;
  for (const band of m.bands) {
    if (value <= band.max) return band;
  }
  return m.bands[m.bands.length - 1];
}

export const LEVEL_ORDER = { good: 0, ok: 1, neutral: 2, warn: 3, bad: 4, critical: 5 };
