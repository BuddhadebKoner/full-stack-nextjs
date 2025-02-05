import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth/";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
   try {
      await connectToDatabase();
      const videos = await Video.find({}).sort({ createdAt: -1 }).lean()
      if (!videos || videos.length === 0) {
         return NextResponse.json([], { status: 404 });
      }

      return NextResponse.json(videos, { status: 200 });
   } catch (error) {
      return (
         NextResponse.json(
            { error: "failed to fetch videos" },
            { status: 500 }
         ));
   }
}

export async function POST(req: NextRequest) {
   try {
      const seassion = await getServerSession(authOptions);
      if (!seassion) return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });

      await connectToDatabase();
      const body: IVideo = await req.json();

      if (
         !body.title ||
         !body.description ||
         !body.thumbnailUrl ||
         !body.videoUrl
      ) {
         return NextResponse.json({ error: "Missing Requied filds" }, { status: 400 });
      }

      const videoData = {
         ...body,
         controls: body.controls ?? true,
         transformation: {
            height: 1920,
            width: 1080,
            quality: body.transformation?.quality ?? 100,
         }
      }

      const newVideo = await Video.create(videoData)
      if (!newVideo) {
         return NextResponse.json(
            { error: "Faild to create video" },
            { status: 500 }
         )
      }

      return NextResponse.json(
         { message: "video Uploaded Sucessfully" },
         { status: 200 },
      )

   } catch (error) {
      return NextResponse.json({ error: "Failed to upload video" }, { status: 500 });
   }
}