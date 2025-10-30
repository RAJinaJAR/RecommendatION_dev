export type Industry = "Oil & Gas" | "Power & Utilities" | "Metals" | "Agri-Commodities" | "Financial Services" | "Multi-Commodity";
export type TradingType = "Physical" | "Financial" | "Both";
export type OrgSize = "Small/Startup" | "Medium" | "Enterprise";
export type CurrentSystem = "Manual/Spreadsheets" | "In-house Tool" | "Other CTRM System" | "None";
export type Priority = "Trading" | "Risk" | "Logistics" | "Settlements" | "Regulatory Compliance" | "Accounting" | "Forecasting" | "ETRM Integration";
export type Region = "North America" | "Europe" | "APAC" | "MENA" | "South America" | "Global";
export type Integration = "ERP" | "Risk Engines" | "Market Data Feeds" | "None" | "Other";
 
export type TimelineRange = "Within 3 months" | "3-6 months" | "6-12 months" | "12+ months";
 
export type TechnologyPreference = "SaaS" | "Server - On-prem" | "Cloud" | "No Preference" | "Other";
 
export interface Budget {
  min: number | null;
  max: number | null;
}
 
export interface UserAnswers {
  industry: Industry | null;
  users: number;
  expectedBudget: Budget;
  goLiveTimeline: TimelineRange | null;
  tradingType: TradingType | null;
  orgSize: OrgSize | null;
  currentSystem: CurrentSystem | null;
  technologyPreference: string | null;
  priorities: Priority[];
  region: Region | null;
  integrations: Integration[];
}
 
export type QuestionType = 'select' | 'multiselect' | 'number' | 'dropdown' | 'budget-range';
 
export interface Question {
  id: keyof UserAnswers;
  text: string;
  type: QuestionType;
  options?: string[];
  icon: React.ReactNode;
}
 
export interface SalesSpecialist {
    name: string;
    email: string;
}
 
export interface Product {
  id: string;
  name: string;
  description: string;
  keyStrengths: string[];
  specialist: SalesSpecialist;
}
 
export interface Feedback {
  rating: 'accurate' | 'inaccurate';
  comment?: string;
  // For 'inaccurate' rating
  userCorrection?: {
    ideal: string; // product id
    strong?: string; // product id
  };
  priorityWeights?: { [key: string]: number };
  // For 'accurate' rating
  generatedSuggestion?: string;
}
 
 
export interface RecommendationRecord {
  id: string;
  timestamp: string;
  answers: UserAnswers;
  recommendations: {
    ideal: Product;
    strong: Product;
  };
  feedback: Feedback;
}
 
export interface LeadDetails {
    fullName: string;
    companyName: string;
    email: string;
    phone?: string;
    notes?: string;
}
