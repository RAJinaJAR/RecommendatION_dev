import React from 'react';
import { Question, Product, SalesSpecialist } from './types';
 
const IconWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="text-ion-blue">{children}</div>
);
 
const FactoryIcon = <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg></IconWrapper>;
const UsersIcon = <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></IconWrapper>;
const BarChart3Icon = <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg></IconWrapper>;
const BuildingIcon = <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg></IconWrapper>;
const SlidersHorizontalIcon = <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg></IconWrapper>;
const LayersIcon = <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></IconWrapper>;
const MapPinIcon = <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></IconWrapper>;
const PlugZapIcon = <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2"/><path d="M6 8H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2"/><path d="m13 14-4 6h6l-4 6"/><path d="M4 11.5a2.5 2.5 0 0 1 0-3C5.5 7.5 7.42 7 9 7h6c1.58 0 3.5.5 4.5 1.5a2.5 2.5 0 0 1 0 3c-1 1-2.92 1.5-4.5 1.5H9c-1.58 0-3.5-.5-4.5-1.5Z"/></svg></IconWrapper>;
const DollarSignIcon = <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></IconWrapper>;
const CalendarDaysIcon = <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" y2="6"/><line x1="8" y1="2" y2="6"/><line x1="3" y1="10" y2="3"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg></IconWrapper>;
const ServerIcon = <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg></IconWrapper>;
 
export const QUESTIONS: Question[] = [
  { id: 'industry', text: "What is your industry or commodity focus?", type: 'select', options: ["Oil & Gas", "Power & Utilities", "Metals", "Agri-Commodities", "Financial Services", "Multi-Commodity"], icon: FactoryIcon },
  { id: 'orgSize', text: "What is your organization size?", type: 'select', options: ["Small/Startup", "Medium", "Enterprise"], icon: BuildingIcon },
  { id: 'users', text: "How many business users do you have?", type: 'number', icon: UsersIcon },
  { id: 'expectedBudget', text: "What's your expected annual budget? (USD)", type: 'budget-range', icon: DollarSignIcon },
  { id: 'goLiveTimeline', text: "What is your desired go-live timeline?", type: 'select', options: ["Within 3 months", "3-6 months", "6-12 months", "12+ months"], icon: CalendarDaysIcon },
  { id: 'tradingType', text: "What type of trading do you engage in?", type: 'select', options: ["Physical", "Financial", "Both"], icon: BarChart3Icon },
  { id: 'currentSystem', text: "What is your current system setup?", type: 'select', options: ["Manual/Spreadsheets", "In-house Tool", "Other CTRM System", "None"], icon: SlidersHorizontalIcon },
  { id: 'technologyPreference', text: "What is your preferred technology platform?", type: 'select', options: ["SaaS", "Server - On-prem", "Cloud", "No Preference", "Other"], icon: ServerIcon },
  { id: 'priorities', text: "What are your key priorities? (select all that apply)", type: 'multiselect', options: ["Trading", "Risk", "Logistics", "Settlements", "Regulatory Compliance", "Accounting", "Forecasting", "ETRM Integration"], icon: LayersIcon },
  { id: 'region', text: "What geography or region do you primarily operate in?", type: 'dropdown', options: ["North America", "Europe", "APAC", "MENA", "South America", "Global"], icon: MapPinIcon },
  { id: 'integrations', text: "Do you require integration with any existing systems? (select all that apply)", type: 'multiselect', options: ["ERP", "Risk Engines", "Market Data Feeds", "None", "Other"], icon: PlugZapIcon }
];
 
export const SPECIALISTS: { [key: string]: SalesSpecialist } = {
    janeDoe: { name: 'Jane Doe', email: 'jane.doe@ion.com' },
    johnSmith: { name: 'John Smith', email: 'john.smith@ion.com' },
    emilyWhite: { name: 'Emily White', email: 'emily.white@ion.com' },
    michaelBrown: { name: 'Michael Brown', email: 'michael.brown@ion.com' },
    sarahJones: { name: 'Sarah Jones', email: 'sarah.jones@ion.com' },
};
 
export const PRODUCTS: Product[] = [
    { id: 'aspect', name: 'Aspect', description: 'A cloud-native CTRM solution designed for rapid setup and deployment, ideal for small to mid-size companies in metals, oil, and agriculture.', keyStrengths: ['Cloud-native', 'Fast setup', 'Metals focus', 'Oil focus', 'Agri-commodities focus', 'Small to medium size'], specialist: SPECIALISTS.janeDoe },
    { id: 'rightangle', name: 'RightAngle', description: 'The industry-leading choice for energy firms with complex physical logistics, supply chain management, and inventory needs.', keyStrengths: ['Energy focus', 'Physical logistics', 'Oil & Gas focus', 'Power & Utilities focus'], specialist: SPECIALISTS.johnSmith },
    { id: 'triplepoint', name: 'TriplePoint', description: 'A powerful platform for companies requiring advanced, sophisticated risk management capabilities across multiple commodities.', keyStrengths: ['Advanced risk', 'Multi-commodity', 'Enterprise scale'], specialist: SPECIALISTS.emilyWhite },
    { id: 'openlink', name: 'Openlink', description: 'The premier solution for large, global enterprises with complex, multi-commodity trading and risk management requirements.', keyStrengths: ['Complex trading', 'Multi-commodity', 'Enterprise scale', 'Global operations', 'Financial services'], specialist: SPECIALISTS.michaelBrown },
    { id: 'allegro', name: 'Allegro', description: 'A real-time ETRM platform optimized for the fast-paced demands of energy and power trading, including renewables and utilities.', keyStrengths: ['Real-time trading', 'Energy focus', 'Power & Utilities focus', 'ETRM Integration'], specialist: SPECIALISTS.sarahJones }
];
 
export const getProductById = (id: string): Product | undefined => {
    return PRODUCTS.find(p => p.id === id);
};
