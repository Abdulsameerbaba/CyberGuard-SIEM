import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, PasswordStrengthResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze the following URL for potential security risks like phishing, malware, or scams. Provide a risk level (Low, Medium, High, Critical), a summary of potential threats, and safety recommendations. URL: "${url}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    riskLevel: { type: Type.STRING, description: 'Low, Medium, High, or Critical' },
                    summary: { type: Type.STRING },
                    recommendations: { type: Type.STRING }
                }
            }
        }
    });

    const json = JSON.parse(response.text);
    return json as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing URL:", error);
    return {
      riskLevel: 'Unknown',
      summary: "Could not analyze the URL. The API may be unavailable or the URL may be malformed.",
    };
  }
};

export const analyzePassword = async (password: string): Promise<PasswordStrengthResult> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the strength of the following password and provide a score from 0 to 100, a brief explanation, and an array of suggestions for improvement. Do not echo the password back in your response. Password: "${password}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.INTEGER },
                        explanation: { type: Type.STRING },
                        suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });
        const json = JSON.parse(response.text);
        return json as PasswordStrengthResult;
    } catch (error) {
        console.error("Error analyzing password:", error);
        return {
            score: 0,
            explanation: "Could not analyze the password. The API may be unavailable.",
            suggestions: [],
        };
    }
};

export const analyzeFile = async (filename: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Based on the filename "${filename}", what are the potential security risks associated with this type of file? Provide a risk level (Low, Medium, High, Critical) and a brief summary.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    riskLevel: { type: Type.STRING, description: 'Low, Medium, High, or Critical' },
                    summary: { type: Type.STRING }
                }
            }
        }
    });

    const json = JSON.parse(response.text);
    return json as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing file:", error);
    return {
      riskLevel: 'Unknown',
      summary: "Could not analyze the file. The API may be unavailable.",
    };
  }
};

export const analyzeFileHash = async (hash: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze the following file hash for security risks, simulating a check against a threat intelligence database. Is this hash associated with known malware (e.g., WannaCry, Cobalt Strike), suspicious activity, or is it a clean/known-good file? Provide a risk level (Low, Medium, High, Critical), and a brief summary of what the hash is associated with. For a critical risk, name the malware if known. Hash: "${hash}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    riskLevel: { type: Type.STRING, description: 'Low, Medium, High, or Critical. "Low" for clean hashes.' },
                    summary: { type: Type.STRING, description: "Summary of the hash's reputation, e.g., 'Known malware hash associated with WannaCry ransomware' or 'Clean hash for kernel32.dll'." }
                }
            }
        }
    });

    const json = JSON.parse(response.text);
    if(json.summary.toLowerCase().includes('clean') || json.summary.toLowerCase().includes('known-good')) {
        json.riskLevel = 'Low';
    }
    return json as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing file hash:", error);
    return {
      riskLevel: 'Unknown',
      summary: "Could not analyze the file hash. The API may be unavailable or the hash may be malformed.",
    };
  }
};