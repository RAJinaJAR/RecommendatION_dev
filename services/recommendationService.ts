import { UserAnswers, Product } from '../types';
import { PRODUCTS } from '../constants';
 
export const getRecommendations = (answers: UserAnswers): { ideal: Product, strong: Product } => {
    const scores: { [key: string]: number } = {
        aspect: 0,
        rightangle: 0,
        triplepoint: 0,
        openlink: 0,
        allegro: 0,
    };
 
    // Rule 1: Organization Size - Every product is rated for each size.
    switch (answers.orgSize) {
        case 'Small/Startup':
            scores.aspect += 3;      // Ideal fit
            scores.rightangle += 0;  // Neutral
            scores.allegro += 0;     // Neutral
            scores.triplepoint -= 1; // Likely overkill
            scores.openlink -= 2;    // Likely overkill
            break;
        case 'Medium':
            scores.aspect += 1;      // Good fit
            scores.rightangle += 2;  // Strong fit
            scores.allegro += 2;     // Strong fit
            scores.triplepoint += 1; // Potential fit
            scores.openlink += 1;    // Potential fit
            break;
        case 'Enterprise':
            scores.aspect -= 2;      // Poor fit
            scores.rightangle += 1;  // Can work
            scores.allegro += 1;     // Can work
            scores.triplepoint += 2; // Good fit
            scores.openlink += 3;    // Ideal fit
            break;
    }
 
    // Rule 2: Industry - Every product is rated for each industry.
    switch (answers.industry) {
        case 'Metals':
        case 'Agri-Commodities':
            scores.aspect += 3;      // Ideal fit
            scores.rightangle += 1;  // Can handle it
            scores.allegro += 0;     // Not its focus
            scores.triplepoint += 0; // Neutral
            scores.openlink += 0;    // Neutral, maybe overkill
            break;
        case 'Oil & Gas':
            scores.aspect += 1;      // Can handle simple cases
            scores.rightangle += 3;  // Ideal fit
            scores.allegro += 1;     // Can handle some aspects
            scores.triplepoint += 1; // Good for risk aspects
            scores.openlink += 1;    // Can handle it
            break;
        case 'Power & Utilities':
            scores.aspect += 0;      // Not its focus
            scores.rightangle += 2;  // Strong logistics fit
            scores.allegro += 3;     // Ideal fit
            scores.triplepoint += 1; // Risk is important here
            scores.openlink += 1;    // Can handle it
            break;
        case 'Financial Services':
            scores.aspect -= 2;      // Poor fit
            scores.rightangle -= 1;  // Not its focus
            scores.allegro -= 1;     // Not its focus
            scores.triplepoint += 2; // Good fit
            scores.openlink += 3;    // Ideal fit
            break;
        case 'Multi-Commodity':
            scores.aspect += 0;      // Likely too simple
            scores.rightangle += 2;  // Good if physicals are involved
            scores.allegro += 1;     // If power is in the mix
            scores.triplepoint += 3; // Ideal fit for complex risk
            scores.openlink += 3;    // Ideal fit for complex trading
            break;
    }
 
    // Rule 3: Priorities - Every product is rated for each priority.
    answers.priorities.forEach(priority => {
        switch (priority) {
            case 'Trading':
                scores.aspect += 1;
                scores.rightangle += 1;
                scores.allegro += 1;
                scores.openlink += 1;
                scores.triplepoint += 1;
                break;
            case 'Risk':
                scores.aspect += 0;      // Basic risk
                scores.rightangle += 1;  // Standard risk
                scores.allegro += 1;     // Standard risk
                scores.triplepoint += 3; // Ideal fit
                scores.openlink += 2;    // Good fit
                break;
            case 'Logistics':
                scores.aspect += 1;      // Basic logistics
                scores.rightangle += 3;  // Ideal fit
                scores.allegro += 1;     // Basic logistics
                scores.triplepoint += 0; // Not a focus
                scores.openlink += 0;    // Not a focus
                break;
            case 'Settlements':
                scores.aspect += 1;
                scores.rightangle += 1;
                scores.allegro += 1;
                scores.triplepoint += 2;
                scores.openlink += 2;
                break;
            case 'Accounting':
                scores.aspect += 1;
                scores.rightangle += 1;
                scores.allegro += 1;
                scores.triplepoint += 2;
                scores.openlink += 2;
                break;
            case 'Regulatory Compliance':
                scores.aspect += 0;
                scores.rightangle += 1;
                scores.allegro += 1;
                scores.triplepoint += 2;
                scores.openlink += 2;
                break;
            case 'Forecasting':
                scores.aspect += 0;
                scores.rightangle += 1;
                scores.allegro += 2; // Stronger focus
                scores.triplepoint += 1;
                scores.openlink += 1;
                break;
            case 'ETRM Integration':
                scores.aspect += 0;       // Not a focus
                scores.rightangle += 1;   // Standard
                scores.allegro += 3;      // Ideal fit
                scores.triplepoint += 1;  // Standard
                scores.openlink += 2;     // Good integration capabilities
                break;
        }
    });
 
    // Rule 4: Trading Type - Every product is rated for each type.
    switch (answers.tradingType) {
        case 'Physical':
            scores.aspect += 1;
            scores.rightangle += 3;  // Ideal fit
            scores.allegro += 2;     // Good fit
            scores.triplepoint -= 1; // Not a focus
            scores.openlink += 0;    // Not a focus
            break;
        case 'Financial':
            scores.aspect -= 1;      // Not a focus
            scores.rightangle -= 1;  // Not a focus
            scores.allegro += 0;     // Not a focus
            scores.triplepoint += 3; // Ideal fit
            scores.openlink += 3;    // Ideal fit
            break;
        case 'Both':
            scores.aspect += 1;      // Can handle simpler cases
            scores.rightangle += 2;  // Good fit
            scores.allegro += 2;     // Good fit
            scores.triplepoint += 2; // Good fit
            scores.openlink += 2;    // Good fit
            break;
    }
 
    // Rule 5: User Count - Using ranges for more granular scoring.
    if (answers.users <= 20) {
        scores.aspect += 2;
        scores.rightangle += 0;
        scores.allegro += 0;
        scores.openlink -= 1;
        scores.triplepoint -= 1;
    } else if (answers.users <= 100) {
        scores.aspect += 1;
        scores.rightangle += 1;
        scores.allegro += 1;
        scores.openlink += 1;
        scores.triplepoint += 1;
    } else if (answers.users <= 200) {
        scores.aspect -= 2;
        scores.rightangle += 1;
        scores.allegro += 1;
        scores.openlink += 2;
        scores.triplepoint += 2;
    } else { // Over 200 users
        scores.aspect -= 3;
        scores.rightangle += 1;
        scores.allegro += 1;
        scores.openlink += 3;
        scores.triplepoint += 3;
    }
 
    // Rule 6: Current System - Every product is rated.
    switch (answers.currentSystem) {
        case 'Manual/Spreadsheets':
            scores.aspect += 3; // Ideal for first-time adopters
            scores.rightangle += 1;
            scores.allegro += 1;
            scores.openlink += 0;
            scores.triplepoint += 0;
            break;
        case 'None':
             scores.aspect += 3; // Ideal for first-time adopters
             scores.rightangle += 1;
             scores.allegro += 1;
             scores.openlink += 0;
             scores.triplepoint += 0;
             break;
        case 'In-house Tool':
            scores.aspect -= 1; // Likely looking for an upgrade
            scores.rightangle += 1;
            scores.allegro += 1;
            scores.triplepoint += 2; // Handles complex migrations
            scores.openlink += 2;    // Handles complex migrations
            break;
        case 'Other CTRM System':
            scores.aspect -= 1; // Likely looking for an upgrade
            scores.rightangle += 1;
            scores.allegro += 1;
            scores.triplepoint += 2; // Handles complex migrations
            scores.openlink += 2;    // Handles complex migrations
            break;
    }
   
    // Rule 7: Budget - Using average budget for scoring.
    const { min, max } = answers.expectedBudget;
    let avgBudget = 0;
    if (min !== null && max !== null) {
        avgBudget = (min + max) / 2;
    } else {
        avgBudget = min || max || 0;
    }
 
    if (avgBudget > 0) {
        if (avgBudget < 50000) {
            scores.aspect += 3;
            scores.rightangle -= 1;
            scores.allegro -= 1;
            scores.openlink -= 2;
            scores.triplepoint -= 2;
        } else if (avgBudget < 200000) {
            scores.aspect += 2;
            scores.rightangle += 1;
            scores.allegro += 1;
            scores.openlink += 0;
            scores.triplepoint += 0;
        } else if (avgBudget < 500000) {
            scores.aspect -= 1;
            scores.rightangle += 2;
            scores.allegro += 2;
            scores.openlink += 2;
            scores.triplepoint += 2;
        } else if (avgBudget < 1000000) { // Tier for larger, but not enterprise-level budgets
            scores.aspect -= 2;
            scores.rightangle += 1;
            scores.allegro += 1;
            scores.openlink += 3;
            scores.triplepoint += 3;
        } else { // Over 1,000,000 - Strong indicator for top-tier enterprise solutions
            scores.aspect -= 3; // Not suitable for very large budgets
            scores.rightangle += 1;
            scores.allegro += 1;
            scores.openlink += 4; // Ideal fit for large budgets
            scores.triplepoint += 4; // Ideal fit for large budgets
        }
    }
 
    // Rule 8: Go-Live Timeline - Every product is rated.
    switch (answers.goLiveTimeline) {
        case "Within 3 months":
            scores.aspect += 3;      // Ideal for rapid deployment
            scores.rightangle -= 1;
            scores.allegro -= 1;
            scores.openlink -= 2;    // Complex setups take time
            scores.triplepoint -= 2; // Complex setups take time
            break;
        case "3-6 months":
            scores.aspect += 2;
            scores.rightangle += 1;
            scores.allegro += 1;
            scores.openlink += 0;
            scores.triplepoint += 0;
            break;
        case "6-12 months":
            scores.aspect += 0;
            scores.rightangle += 1;
            scores.allegro += 1;
            scores.openlink += 1;
            scores.triplepoint += 1;
            break;
        case "12+ months":
            scores.aspect -= 2;      // Not a fit for long projects
            scores.rightangle += 1;
            scores.allegro += 1;
            scores.openlink += 2;    // Suited for long-term implementation
            scores.triplepoint += 2; // Suited for long-term implementation
            break;
    }
 
    // Rule 9: Technology Preference
    switch (answers.technologyPreference) {
        case "SaaS":
            scores.aspect += 3;
            scores.allegro += 1;
            scores.triplepoint -= 1;
            scores.openlink -= 1;
            break;
        case "Cloud":
            scores.aspect += 2;
            scores.rightangle += 1;
            scores.allegro += 2;
            scores.triplepoint += 1;
            scores.openlink += 1;
            break;
        case "Server - On-prem":
            scores.aspect -= 2;
            scores.rightangle += 2;
            scores.allegro += 1;
            scores.triplepoint += 2;
            scores.openlink += 2;
            break;
        case "No Preference":
            break;
    }
 
    const sortedProducts = Object.entries(scores).sort(([, a], [, b]) => b - a);
 
    const idealId = sortedProducts[0][0];
    const strongId = sortedProducts[1][0];
   
    const idealProduct = PRODUCTS.find(p => p.id === idealId) || PRODUCTS[0];
    const strongProduct = PRODUCTS.find(p => p.id === strongId) || PRODUCTS[1];
 
    // Ensure ideal and strong products are not the same
    if (idealProduct.id === strongProduct.id) {
       const nextBestId = sortedProducts[2][0];
       const nextBestProduct = PRODUCTS.find(p => p.id === nextBestId) || PRODUCTS[2];
       return { ideal: idealProduct, strong: nextBestProduct };
    }
   
    return { ideal: idealProduct, strong: strongProduct };
};
