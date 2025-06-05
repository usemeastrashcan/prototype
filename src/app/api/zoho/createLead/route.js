
import axios from "axios"
import fs from "fs"
import path from "path"

function updateEnvFile(key, value) {
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
  const tokenUrl = `${process.env.ZOHO_ACCOUNTS_URL}/oauth/v2/token`
  const params = new URLSearchParams()
  params.append("refresh_token", process.env.ZOHO_REFRESH_TOKEN)
  params.append("client_id", process.env.ZOHO_CLIENT_ID)
  params.append("client_secret", process.env.ZOHO_CLIENT_SECRET)
  params.append("grant_type", "refresh_token")

  const response = await axios.post(tokenUrl, params)
  const { access_token, expires_in, api_domain } = response.data

  if (access_token) updateEnvFile("ZOHO_ACCESS_TOKEN", access_token)
  if (expires_in) updateEnvFile("ZOHO_TOKEN_EXPIRY_TIME", (Date.now() + expires_in * 1000).toString())
  if (api_domain && process.env.ZOHO_API_BASE_URL !== api_domain + "/crm/v2") {
    updateEnvFile("ZOHO_API_BASE_URL", api_domain + "/crm/v2")
  }

  return access_token
}

const ensureAuthenticated = async () => {
  const expiry = Number.parseInt(process.env.ZOHO_TOKEN_EXPIRY_TIME || "0", 10)
  if (!process.env.ZOHO_ACCESS_TOKEN || Date.now() >= expiry) {
    return await refreshAccessToken()
  }
  return process.env.ZOHO_ACCESS_TOKEN
}

// 👇 POST route to create a lead
export async function POST(req) {
  try {
    const body = await req.json()
    const { first_name, last_name, email, company, phone } = body

    if (!last_name || !company) {
      return new Response(JSON.stringify({ message: "Last Name and Company are required." }), { status: 400 })
    }

    const token = await ensureAuthenticated()
    const url = `${process.env.ZOHO_API_BASE_URL}/Leads`
    const payload = {
      data: [
        {
          First_Name: first_name,
          Last_Name: last_name,
          Email: email,
          Company: company,
          Phone: phone,
        },
      ],
    }

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json",
      },
    })

    return new Response(JSON.stringify(response.data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    const errData = error.response?.data || { message: error.message }
    return new Response(JSON.stringify({ message: "Failed to create lead", ...errData }), {
      status: error.response?.status || 500,
    })
  }
}
