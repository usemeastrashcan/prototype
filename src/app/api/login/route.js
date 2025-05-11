import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB  from '@/utils/db';
import Customer from '@/models/Customer';

export async function POST(request) {
  try {
    await connectDB();

    const { email } = await request.json();

    const user = await Customer.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 400 }
      );
    }


    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role }, // include role in the token
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const response = NextResponse.json(
      {
        message: 'Login successful',
        role: user.role, // ⬅️ send role in response
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'authToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { 
        message: 'Something went wrong', 
        error: error.message 
      },
      { status: 500 }
    );
  }
}