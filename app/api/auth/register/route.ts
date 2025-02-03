import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";


export async function POST(request: NextRequest) {
   try {
      const { email, password, username } = await request.json()

      if (!email || !password || !username) {
         return NextResponse.json(
            { error: "Email and password are requird" },
            { status: 400 }
         )
      }


      await connectToDatabase();
      const existingUser = await User.findOne({ email })
      if (existingUser) {
         return NextResponse.json(
            { error: "User Allready exist ." },
            { status: 400 }
         )
      }

      await User.create({
         email,
         password,
         username
      })

      return NextResponse.json(
         { message: "User register sucessfully" },
         { status: 201 }
      )

   } catch (error) {
      return NextResponse.json(
         { error: "Faild to register users" },
         { status: 500 }
      )
   }
}