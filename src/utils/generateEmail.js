import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateEmail(customer) {
  try {
    // Define the system prompt for Gemini to act as a professional email writer
    const systemPrompt = `
      You are a professional email writer. Your task is to write a clear, polite, and personalized email
      for the customer based on their status. Use the customer's name and email where appropriate.

      Customer Status: ${customer.status}
      Customer Name: ${customer.name}
      Customer Email: ${customer.email}

      Based on the customer's status ("${customer.status}"), please generate the email content.
      Consider including a subject line and a professional closing.

      For example, if the status is "new", you might write a welcome email.
      If the status is "returning", you might inquire about their recent experience.
      If the status is "issue reported", you might acknowledge their issue and next steps.
    `;

    // Call Gemini API to generate the email
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: systemPrompt,
    });

    // If response has an error, throw an error
    if (!response || !response.text) {
      throw new Error('Gemini API response error: No email content returned');
    }

    console.log("Gemini API response:", response.text);

    // Process response and return the generated email content
    return response.text.trim();  // Return the email content directly from response.text

  } catch (error) {
    console.error('Error generating email:', error);
    return `Error generating email: ${error.message}`;  // Or a more user-friendly error message
  }
}

export default generateEmail;
