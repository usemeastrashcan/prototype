import nodemailer from 'nodemailer';
import Customer from '@/models/Customer';
import connectDB from '@/utils/db';
import { Types } from 'mongoose';
import { NextResponse } from 'next/server';

// Configure transporter outside the handler for reusability
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'lempi.kilback98@ethereal.email',
        pass: 'gQmyHcQfPyebsB2euw'
    }
});

// Enhanced email sending function with retries
async function sendEmailWithRetry(mailOptions, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      return info;
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry ${i + 1} after email send failure`);
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
}

export async function POST(req) {
  try {
        const { customerId, sendEmailConfirmation, emailContent } = await req.json();

    // Validate required fields
    if (!customerId || sendEmailConfirmation === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields: customerId or sendEmailConfirmation' },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(customerId)) {
      return NextResponse.json(
        { message: 'Invalid customerId format' },
        { status: 400 }
      );
    }

    await connectDB();

    // More secure query - only select needed fields
    const customer = await Customer.findById(customerId).select('email');
    if (!customer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    if (!sendEmailConfirmation) {
      return NextResponse.json(
        { message: 'Email not sent (confirmation denied)' },
        { status: 200 }
      );
    }

    // Validate email content
    if (!emailContent || typeof emailContent !== 'string') {
      return NextResponse.json(
        { message: 'Invalid email content' },
        { status: 400 }
      );
    }

    // Sanitize email content (basic example)
    const sanitizedContent = emailContent.replace(/<[^>]*>?/gm, '');

    const mailOptions = {
      from: `"Your Company" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: 'Your Requested Information',
      text: sanitizedContent,
      html: `<p>${sanitizedContent.replace(/\n/g, '<br>')}</p>`,
    };

    await sendEmailWithRetry(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in email sending:', error);
    return NextResponse.json(
      { 
        message: 'Failed to send email',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}