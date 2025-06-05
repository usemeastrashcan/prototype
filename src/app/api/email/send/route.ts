import axios from "axios"
import fs from "fs"
import path from "path"

// Reuse your existing utility functions
function updateEnvFile(key: string, value: string) {
  const envPath = path.resolve(process.cwd(), ".env.local")
  let env = fs.readFileSync(envPath, "utf-8")
  const regex = new RegExp(`^${key}=.*`, "m")
  const newLine = `${key}=${value}`
  if (env.match(regex)) {
    env = env.replace(regex, newLine)
  } else {
    env += `\n${newLine}`
  }
  fs.writeFileSync(envPath, env)
}

const refreshAccessToken = async () => {
  if (!process.env.ZOHO_REFRESH_TOKEN) {
    console.error("No refresh token available.")
    throw new Error("No refresh token.")
  }

  const tokenUrl = `${process.env.ZOHO_ACCOUNTS_URL}/oauth/v2/token`
  const params = new URLSearchParams()
  params.append("refresh_token", process.env.ZOHO_REFRESH_TOKEN)
  params.append("client_id", process.env.ZOHO_CLIENT_ID!)
  params.append("client_secret", process.env.ZOHO_CLIENT_SECRET!)
  params.append("grant_type", "refresh_token")

  try {
    const response = await axios.post(tokenUrl, params)
    const { access_token, expires_in, api_domain } = response.data

    if (access_token) updateEnvFile("ZOHO_ACCESS_TOKEN", access_token)
    if (expires_in) updateEnvFile("ZOHO_TOKEN_EXPIRY_TIME", (Date.now() + expires_in * 1000).toString())
    if (api_domain && process.env.ZOHO_API_BASE_URL !== api_domain + "/crm/v2") {
      updateEnvFile("ZOHO_API_BASE_URL", api_domain + "/crm/v2")
    }

    return access_token
  } catch (error: any) {
    console.error("Token refresh error:", error.response?.data || error.message)
    if (error.response?.data?.error === "invalid_code" || error.response?.data?.error === "invalid_client") {
      updateEnvFile("ZOHO_REFRESH_TOKEN", "")
    }
    throw error
  }
}

const ensureAuthenticated = async () => {
  const expiry = Number.parseInt(process.env.ZOHO_TOKEN_EXPIRY_TIME || "0", 10)
  if (!process.env.ZOHO_ACCESS_TOKEN || Date.now() >= expiry) {
    return await refreshAccessToken()
  }
  return process.env.ZOHO_ACCESS_TOKEN
}

// Named export for POST request to send email
export async function POST(request: Request) {
  try {
    const token = await ensureAuthenticated()
    const emailUrl = `${process.env.ZOHO_API_BASE_URL}/Emails`

    // Get email data from request body
    const { to, subject, body, leadId } = await request.json()

    // Validate required fields
    if (!to || !subject || !body) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required fields (to, subject, body)",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    const emailData = {
      from: process.env.DEFAULT_FROM_EMAIL || "noreply@example.com",
      to,
      subject,
      content: body,
      mail_format: "html", // or "text" if sending plain text
      related_to: {
        id: leadId,
        module: "Leads",
      },
    }

    // Send the email
    const emailResponse = await axios.post(
      emailUrl,
      { data: [emailData] },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json",
        },
      },
    )

    // Update the lead's $converted field to true
    if (leadId) {
      const leadUrl = `${process.env.ZOHO_API_BASE_URL}/Leads/${leadId}`
      await axios.put(
        leadUrl,
        {
          data: [
            {
              id: leadId,
              $converted: true,
            },
          ],
        },
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${token}`,
            "Content-Type": "application/json",
          },
        },
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
        data: emailResponse.data,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error: any) {
    const errData = error.response?.data || { message: error.message }
    console.error("Email sending error:", errData)

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to send email",
        error: errData,
      }),
      {
        status: error.response?.status || 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
