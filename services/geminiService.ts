import { GoogleGenAI } from "@google/genai";
import { UserAnswers, Product } from '../types';

const getBudgetString = (budget: UserAnswers['expectedBudget']): string => {
    let budgetString = 'Not Specified';
    const { min, max } = budget;
    if (min !== null && max !== null) {
      budgetString = `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    } else if (min !== null) {
      budgetString = `From $${min.toLocaleString()}`;
    } else if (max !== null) {
      budgetString = `Up to $${max.toLocaleString()}`;
    }
    return budgetString;
};

export const generateComparisonText = async (
    answers: UserAnswers,
    idealProduct: Product,
    strongProduct: Product
): Promise<string> => {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        return `Based on your focus on ${answers.priorities.join(', ')}, ${idealProduct.name} is the ideal choice. It excels in ${idealProduct.keyStrengths.join(', ')}. As a strong alternative, consider ${strongProduct.name}, which offers great capabilities in ${strongProduct.keyStrengths.join(', ')}.`;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
        You are an expert marketing assistant for ION Group, a financial software company.
        A potential client has completed a questionnaire. Based on their answers, we've identified two suitable products: an "Ideal Fit" and a "Strong Alternative".

        Your task is to write a short, persuasive, and positive comparison (3-4 sentences).
        1. Start by acknowledging why the "Ideal Fit" is the top recommendation, linking it to the client's most important priorities.
        2. Seamlessly introduce the "Strong Alternative", highlighting its key strengths and explaining why it's also an excellent choice, perhaps based on a different aspect of their answers (e.g., budget, timeline, specific feature).
        3. Frame the choice as a "win-win", empowering the client.
        4. Make it feel personal by referencing their specific answers. Do NOT use markdown or bullet points. Write in a conversational paragraph.
        5. Do NOT repeat the product names in your explanation. Refer to them by their role (e.g., "The ideal solution," "This platform," "The alternative," etc.).

        **Client's Answers:**
        - Industry: ${answers.industry}
        - Organization Size: ${answers.orgSize}
        - Number of Users: ${answers.users}
        - Expected Budget (Annual USD): ${getBudgetString(answers.expectedBudget)}
        - Desired Go-Live Timeline: ${answers.goLiveTimeline || 'Not Specified'}
        - Key Priorities: ${answers.priorities.join(', ')}

        **Ideal Fit Product:**
        - Name: ${idealProduct.name}
        - Description: ${idealProduct.description}
        - Key Strengths: ${idealProduct.keyStrengths.join(', ')}

        **Strong Alternative Product:**
        - Name: ${strongProduct.name}
        - Description: ${strongProduct.description}
        - Key Strengths: ${strongProduct.keyStrengths.join(', ')}

        Now, generate the personalized comparison.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating comparison text:", error);
        return `Based on your focus on ${answers.priorities.join(', ')}, the recommended solution is an excellent choice due to its strengths in ${idealProduct.keyStrengths.join(', ')}. As a strong alternative, you could also consider a platform that excels in ${strongProduct.keyStrengths.join(', ')}, giving you another great option to evaluate.`;
    }
};

export const generateAdditionalSuggestion = async (
    answers: UserAnswers,
    idealProduct: Product
): Promise<string> => {
     if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        return "As a next step, we recommend preparing a list of key stakeholders from your team who will be involved in the implementation process.";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
        You are a helpful onboarding assistant for ION Group. A client has just been recommended the "${idealProduct.name}" CTRM solution.
        
        Based on their questionnaire answers, provide a single, concise, and actionable tip or "next step" they could take to prepare for implementation or evaluation. Keep it to one friendly and encouraging sentence.

        **Client's Answers:**
        - Industry: ${answers.industry}
        - Key Priorities: ${answers.priorities.join(', ')}
        - Required Integrations: ${answers.integrations.join(', ') || 'None specified'}
        - Desired Go-Live Timeline: ${answers.goLiveTimeline || 'Not Specified'}
        
        **Examples of good suggestions:**
        - If they require 'ERP' integration: "To ensure a smooth start, you could begin gathering the API documentation for your existing ERP system."
        - If their timeline is 'Within 3 months': "Given your fast-paced timeline, a great next step is to identify the key project stakeholders from your team."
        - If 'Risk' is a high priority: "To get the most out of your evaluation, we suggest preparing a few key risk scenarios you'd like to model."

        Now, generate a new, unique suggestion for this specific client.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
             config: {
                temperature: 0.8, // Add some creativity to the suggestions
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating additional suggestion:", error);
        return "As a next step, we recommend preparing a list of key stakeholders from your team who will be involved in the implementation process.";
    }
};
