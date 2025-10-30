import { GoogleGenAI } from "@google/genai";
import { UserAnswers, Product } from '../types';
 
export const generateComparisonText = async (
    answers: UserAnswers,
    idealProduct: Product,
    strongProduct: Product
): Promise<string> => {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        return `**${idealProduct.name}:**\n- Based on your focus on ${answers.priorities.join(', ')}, this is an excellent fit.\n- Excels in ${idealProduct.keyStrengths.join(', ')}.\n\n**${strongProduct.name}:**\n- A strong alternative that also supports ${answers.priorities.join(', ')}.\n- Key strengths include ${strongProduct.keyStrengths.join(', ')}.`;
    }
 
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
 
    const prompt = `
        You are an expert marketing assistant for ION Group, a financial software company.
        Your task is to write a personalized and persuasive comparison for two recommended products, tailored to a potential client's specific needs based on their questionnaire answers.
 
        **Instructions:**
        1.  For each product, explain in bullet points *why* it is a strong solution for the client.
        2.  Directly connect the product's key strengths to the client's stated priorities, industry, and organizational size.
        3.  Keep each bullet point concise and impactful, ideally under 15 words.
        4.  Present the explanation as a list of bullet points for each product. Use markdown for bullet points (e.g., "- Point 1").
        5.  Start with a heading for each product like "**Product Name:**".
        6.  The output should only be the markdown text containing the comparison. Do not add any introductory or concluding sentences.
 
        **Client's Answers:**
        - Industry: ${answers.industry}
        - Organization Size: ${answers.orgSize}
        - Key Priorities: ${answers.priorities.join(', ')}
        - Trading Type: ${answers.tradingType}
        - Current System: ${answers.currentSystem}
 
        **Products to Compare:**
        - Ideal Fit: ${idealProduct.name}
        - Strong Alternative: ${strongProduct.name}
 
        Now, generate the comparison.
    `;
 
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating comparison text:", error);
        return `**${idealProduct.name}:**\n- Based on your focus on ${answers.priorities.join(', ')}, this is an excellent fit.\n- Excels in ${idealProduct.keyStrengths.join(', ')}.\n\n**${strongProduct.name}:**\n- A strong alternative that also supports ${answers.priorities.join(', ')}.\n- Key strengths include ${strongProduct.keyStrengths.join(', ')}.`;
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
        - Preferred Technology: ${answers.technologyPreference || 'Not Specified'}
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
