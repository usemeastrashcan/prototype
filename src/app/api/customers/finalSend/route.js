import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Customer from '@/models/Customer'; 
import connectDB from '@/utils/db'; 
import { Types } from 'mongoose'; // Import Types from Mongoose to validate ObjectId

dotenv.config();

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Example with Gmail; you can use any email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or App-specific password (use environment variables)
  },
});

// POST route to send the email
export async function POST(req) {
  try {
    const { customerId, sendEmailConfirmation, emailContent } = await req.json(); // customerId and confirmation flag from request body

    await connectDB(); // Connect to the database

    // Check if confirmation flag is provided
    if (sendEmailConfirmation === undefined) {
      return Response.json({ message: 'Send email confirmation flag is missing.' }, { status: 400 });
    }

    // Ensure the customerId is a valid ObjectId
    if (!Types.ObjectId.isValid(customerId)) {
      return Response.json({ message: 'Invalid customerId format' }, { status: 400 });
    }

    // Fetch customer details from your database (example using MongoDB)
    console.log("Fetching customer with ID:", customerId);

    const customer = await Customer.findById(customerId); // Find customer by ID
    console.log("Fetched customer:", customer);

    if (!customer) {
      return Response.json({ message: 'Customer not found' }, { status: 404 });
    }

    // If confirmation is true, send the email
    if (sendEmailConfirmation) {
      // Send the email via Nodemailer
      const mailOptions = {
        from: process.env.EMAIL_USER, // Sender email
        to: customer.email,          // Receiver email (customer's email)
        subject: 'Your Requested Email', // Subject of the email
        text: emailContent,           // Email body content
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);

      return Response.json({ message: 'Email sent successfully' }, { status: 200 });
    } else {
      return Response.json({ message: 'Email not sent (confirmation denied).' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json({ message: 'Error sending email', error: error.message }, { status: 500 });
  }
}
