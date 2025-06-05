import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the GoogleGenerativeAI with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

interface Message {
  role: "user" | "assistant"
  content: string
}

interface LeadInfo {
  id: string
  name: string
  email: string
  company: string
}

async function generateContentWithRetry(model: any, prompt: string, maxRetries = 5, initialDelay = 1000) {
  let retries = 0
  let delay = initialDelay

  while (retries < maxRetries) {
    try {
      // Attempt to generate content
      const result = await model.generateContent(prompt)
      return result // Return result on success
    } catch (error: any) {
      // Check if the error is a 503 Service Unavailable (model overloaded)
      if (error.status === 503) {
        console.warn(
          `Model overloaded (503). Retrying in ${delay / 1000} seconds... (Attempt ${retries + 1}/${maxRetries})`,
        )
        // Wait for the calculated delay, adding jitter for better distribution
        await new Promise((resolve) => setTimeout(resolve, delay + Math.random() * 500))
        delay *= 2 // Double the delay for the next retry (exponential backoff)
        retries++
      } else {
        // Re-throw other types of errors immediately as they are not transient
        throw error
      }
    }
  }
  // If all retries fail, throw an error
  throw new Error(`Failed to generate content after ${maxRetries} retries due to model overload.`)
}

/**
 * POST handler for the chat API route.
 * Processes user messages to generate and modify emails for sales leads.
 * @param request The incoming Next.js request.
 * @returns A NextResponse containing the AI's message or an error.
 */
export async function POST(request: Request) {
  try {
    // Parse the request body
    const { message, leadInfo, conversationHistory } = await request.json()

    // Validate the presence of the Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    // Get the generative model instance
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Build the system prompt to guide the AI's behavior
    // The prompt now explicitly instructs the model to understand context
    // and to respond if the request is out of scope.
    const systemPrompt = `You are an AI assistant specialized in generating professional and personalized emails for sales leads.

Lead Information:
- Name: ${leadInfo.name}
- Email: ${leadInfo.email}
- Company: ${leadInfo.company}

Your primary roles are:
1. To generate professional, personalized emails for this specific lead.
2. To help modify, refine, or improve existing email content based on user feedback.
3. To maintain context from the 'Previous conversation context' to make iterative improvements to emails.
4. Always format emails with proper structure: Subject, Greeting, Body, Closing, Signature.

Crucial Instruction:
- If the user's request is NOT directly related to generating, modifying, refining, or improving emails for the sales lead, you MUST politely respond with: "I am not designed to do that. I'm specifically designed to help you generate and modify emails for your leads." You must understand the intent from the conversation context.

Guidelines for email content:
- Emails should be professional but friendly in tone.
- Personalize the content using the lead's name and company where appropriate.
- Keep emails concise, clear, and to the point.
- Include a clear call-to-action relevant to the email's purpose.
- Use proper email formatting and paragraph breaks for readability.

Previous conversation context:
${conversationHistory.map((msg: Message) => `${msg.role}: ${msg.content}`).join("\n")}

Current user request: ${message}

Based on the above, please provide your response:`

    // Call the generateContentWithRetry function to handle the API request
    const result = await generateContentWithRetry(model, systemPrompt)
    const response = await result.response
    const aiMessage = response.text()

    // Return the AI's message as a JSON response
    return NextResponse.json({ message: aiMessage })
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error in chat API:", error)
    // Return an error response to the client
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
