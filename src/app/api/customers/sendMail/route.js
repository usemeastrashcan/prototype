// app/api/customers/action/route.js
import connectDB from '@/utils/db';
import Customer from "@/models/Customer";
import generateEmail from "@/utils/generateEmail";
import { cookies } from 'next/headers'; // Import cookies function [^1]

export async function POST(req) {
  try {
    // Get the customer cookie instead of parsing from request body
    const cookieStore = await cookies();
    const customerCookie = cookieStore.get('customer');
    
    if (!customerCookie || !customerCookie.value) {
      return new Response(
        JSON.stringify({ message: "No customer selected!" }),
        { status: 400 }
      );
    }
    
    // Parse the customer data from the cookie
    let customerData;
    try {
      customerData = JSON.parse(customerCookie.value);
    } catch (error) {
      return new Response(
        JSON.stringify({ message: "Invalid customer data in cookie" }),
        { status: 400 }
      );
    }
    
    // Extract the customer ID from the parsed data
    const customerId = customerData._id;
    
    if (!customerId) {
      return new Response(
        JSON.stringify({ message: "Customer ID not found in cookie data" }),
        { status: 400 }
      );
    }
    
    // Connect to the database
    console.log(customerId);
    await connectDB();

    // Find the customer by ID
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return new Response(
        JSON.stringify({ message: "Customer not found!" }),
        { status: 404 }
      );
    }
    console.log("customer found");

    // Suggest the action based on customer status
    let suggestedAction = "";
    if (customer.status === 'new') {
      suggestedAction = "Generate welcome email";
    } else if (customer.status === 'active') {
      suggestedAction = "Send promotional offer email";
    } else {
      suggestedAction = "Send reactivation email";
    }

    // Generate the email based on customer details (only generate the email)
    const emailContent = await generateEmail(customer);
    console.log("Generated email content:", emailContent);

    // Return the suggested action and email content to the user for review
    return new Response(
      JSON.stringify({ 
        suggestedAction: suggestedAction, 
        emailContent: emailContent 
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}