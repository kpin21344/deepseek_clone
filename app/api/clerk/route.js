import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  const wh = new Webhook(process.env.SIGNING_SECRET);

  // Get headers from the request
  const svixId = req.headers.get('svix-id');
  const svixTimestamp = req.headers.get('svix-timestamp');
  const svixSignature = req.headers.get('svix-signature');

  const svixHeaders = {
    'svix-id': svixId,
    'svix-timestamp': svixTimestamp,
    'svix-signature': svixSignature,
  };

  // Get payload
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify payload
  const { data, type } = wh.verify(body, svixHeaders);

  // Prepare user data
  const userData = {
    _id: data.id,
    email: data.email_address[0].email_address,
    name: `${data.first_name} ${data.last_name}`,
    image: data.image_url,
  };

  await connectDB();

  switch (type) {
    case 'user.created':
      await User.create(userData);
      break;
    case 'user.updated':
      await User.findByIdAndUpdate(data.id, userData);
      break;
    case 'user.deleted':
      await User.findByIdAndDelete(data.id);
      break;
    default:
      // handle unknown event types if needed
      break;
  }

  return NextResponse.json({ message: 'event received' });
}