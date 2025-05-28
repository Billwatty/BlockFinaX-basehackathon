// types/regulatory.ts
export interface RegulatoryAnalysisInput {
  query: string;
  country: string;
  productCategory: string;
  activityType: string;
}

export interface RegulatoryAnalysisResult {
  _id: string;
  query: string;
  country: string;
  productCategory: string;
  activityType: string;
  summary: string;
  citations: string[];
  lastUpdated: string;
}

export interface ParsedAnalysisResult {
  summary: string;
  restrictionLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  keyRequirements: string[];
  citations: string[];
  lastUpdated: string;
  _id: string;
}

export interface Country {
  code: string;
  name: string;
}

export interface ToastMessage {
  type: 'success' | 'error';
  message: string;
}

// constants/regulatory.ts
export const COUNTRIES: Country[] = [
  { code: 'NG', name: 'Nigeria' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'EG', name: 'Egypt' },
  { code: 'KE', name: 'Kenya' },
  { code: 'GH', name: 'Ghana' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'CD', name: 'DR Congo' },
  { code: 'UG', name: 'Uganda' },
  { code: 'MA', name: 'Morocco' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CI', name: 'Côte d\'Ivoire' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'ZW', name: 'Zimbabwe' },
];

export const PRODUCT_CATEGORIES = [
  'Agriculture & Food',
  'Chemicals & Pharmaceuticals',
  'Consumer Goods',
  'Electronics & Technology',
  'Industrial Equipment',
  'Medical Devices',
];

export const ACTIVITY_TYPES = [
  'Import',
  'Export',
  'Transit',
  'Re-export'
];