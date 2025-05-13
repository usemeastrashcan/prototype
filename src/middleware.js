import { NextResponse } from "next/server"
import { jwtVerify } from "jose" // Using jose instead of jsonwebtoken for Edge compatibility

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("authToken")?.value

  // Block unauthenticated access
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Verify token with jose (works in Edge runtime)
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))

    // Role-based access control for API routes
    const roleRoutes = {
      "/api/customers/summarize": ["docer"],
      "/api/customers/sendMail": ["mailer"],
    }

    const requiredRoles = Object.entries(roleRoutes).find(([route]) => pathname.startsWith(route))?.[1]

    if (requiredRoles && !requiredRoles.includes(payload.role)) {
      return NextResponse.json({ error: `Forbidden: ${requiredRoles.join(", ")} access only` }, { status: 403 })
    }

    // Add user data to request headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", payload.userId)
    requestHeaders.set("x-user-role", payload.role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (err) {
    console.error("Authentication error:", err)
    return NextResponse.redirect(new URL("/login?error=invalid_token", request.url))
  }
}

export const config = {
  matcher: [
    // API routes
    "/api/customers/summarize",
    "/api/customers/sendMail",
    // Frontend protected routes
    "/chatbox",
    "/addCustomer",
  ],
}
