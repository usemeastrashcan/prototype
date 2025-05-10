// app/api/customers/all/route.js
import connectDB from '@/utils/db';
import Customer from "@/models/Customer";

export async function GET() {
  try {
    await connectDB();
    const customers = await Customer.find().sort({ createdAt: -1 });

    // Explicitly set Content-Type to application/json
    return new Response(JSON.stringify(customers), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Return a more descriptive error message
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
    