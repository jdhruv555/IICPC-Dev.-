
import { GoogleGenAI } from "@google/genai";
import { OsTarget, SecurityThreat, ArtifactType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateArchitectArtifact = async (os: OsTarget, type: ArtifactType): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    let systemPrompt = '';
    let userContent = '';

    if (type === ArtifactType.SPECIFICATION) {
      systemPrompt = `
        You are a Senior Security Architect. Create a rigorous "Technical Writeup" for a Secure Proctored Exam Environment on ${os}.
        
        REQUIREMENTS:
        - Block all network traffic except codeforces.com and its CDN/subdomains.
        - Block all other apps, terminals, and system shortcuts.
        - Anti-bypass: Detect VM, Debuggers, DMA, and Process Hollowing.
        
        OUTPUT FORMAT: Markdown.
        SECTIONS:
        1. Architecture Diagram (Mermaid text description)
        2. Kernel-Level Isolation Strategy (WFP for Windows, NE for macOS, etc.)
        3. Network Filtering Implementation
        4. Anti-Cheat & Integrity Checks
        5. Bypass Vectors & Countermeasures
      `;
      userContent = `Generate the detailed architecture specification for ${os}.`;
    } else {
      systemPrompt = `
        You are a Senior Systems Programmer. Write the core implementation code for a Secure Proctoring App on ${os}.
        
        LANGUAGE: ${os.includes('Windows') ? 'C++ (Visual Studio / Win32 API / WFP)' : os.includes('macOS') ? 'Swift (SystemExtensions)' : 'C++ (eBPF/libbpf)'}.
        
        PROVIDE CODE FOR:
        1. Network Filter (Whitelisting codeforces.com).
        2. Process Lockdown (Preventing alt-tab, blocking blacklisted apps).
        3. Main Entry Point (Setting up the kiosk session).
        
        Output strictly valid code blocks with comments explaining the security logic.
      `;
      userContent = `Generate the implementation codebase for ${os}.`;
    }

    const response = await ai.models.generateContent({
      model,
      contents: userContent,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
      }
    });

    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "## System Error\n\nUnable to contact the AI Architect service.";
  }
};

export const analyzeThreatScenario = async (processList: string[], os: OsTarget): Promise<SecurityThreat[]> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Analyze this process list from a ${os} secure exam session:
      ${JSON.stringify(processList)}

      Identify active threats (screen sharing, debuggers, communication tools, cheats).
      Ignore benign system processes.
      Return JSON: [{ "name": "Process Name", "riskLevel": "HIGH"|"MEDIUM"|"LOW", "description": "Reason", "mitigation": "Action" }]
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as SecurityThreat[];
  } catch (error) {
    console.error("Gemini Threat Analysis Error:", error);
    return [];
  }
};

export const checkUrlAccess = (url: string): { allowed: boolean; reason: string } => {
  try {
    const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    const whitelist = ['codeforces.com', 'assets.codeforces.com', 'fonts.googleapis.com', 'cdnjs.cloudflare.com'];
    
    const isAllowed = whitelist.some(d => hostname === d || hostname.endsWith(`.${d}`));
    
    if (isAllowed) {
      return { allowed: true, reason: `Whitelisted Domain: ${hostname}` };
    }
    return { allowed: false, reason: `Blocked Host: ${hostname} (Policy: Default Deny)` };
  } catch (e) {
    return { allowed: false, reason: 'Invalid URL Format' };
  }
};
