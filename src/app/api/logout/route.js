import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear the auth cookie by setting it to expire
    cookies().set({
      name: "authToken",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // expires immediately
      path: "/",
    });

    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
