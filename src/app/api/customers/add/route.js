import connectDB  from '@/utils/db';
import Customer from "@/models/Customer";

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, phone } = await request.json();

    if (!name || !email || !phone) {
      return Response.json({ message: "Missing fields" }, { status: 400 });
    }

    const newCustomer = await Customer.create({ name, email, phone });
    return Response.json(newCustomer, { status: 201 });
  } catch (error) {
    return Response.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// This code defines a POST route for adding a new customer to the database.
