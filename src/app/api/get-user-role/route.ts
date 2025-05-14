import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// This API route will extract the role from the authToken cookie
export async function GET() {
  try {
    // Get the authToken cookie
    const cookieStore = await cookies()
    const authToken = cookieStore.get("authToken")?.value

    if (!authToken) {
      return NextResponse.json({ error: "Authentication token not found" }, { status: 401 })
    }

    try {
      // Verify and decode the token
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET!)

      if (!decoded || typeof decoded !== "object" || !decoded.role) {
        return NextResponse.json({ error: "Invalid token format" }, { status: 401 })
      }

      // Return just the role
      return NextResponse.json({ role: decoded.role })
    } catch (error) {
      console.error("Error verifying token:", error)
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error in get-user-role API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
