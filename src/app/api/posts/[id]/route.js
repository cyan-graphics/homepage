import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Post from "@/models/Post";

export const GET = async (request, { params }) => {
  const { id } = await params;

  try {
    await connect();

    const post = await Post.findById(id);

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Database Error", code: err.code || "DATABASE_ERROR" },
      { status: 500 }
    );
  }
};

export const DELETE = async (request, { params }) => {
  const { id } = await params;

  try {
    await connect();

    const post = await Post.findByIdAndDelete(id);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    return NextResponse.json({ id });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Database Error", code: err.code || "DATABASE_ERROR" },
      { status: 500 }
    );
  }
};

export const PUT = async(req,{params})=>{
  const { id } = await params;
  const body = await req.json();
  
  try {
    await connect();
    
    const updatePost = await Post.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatePost) {
      return new NextResponse("Post not found", { status: 404 });
    }
    return NextResponse.json(updatePost);
  } catch (err) {
    return NextResponse.json({ error: err.message || "Database Error" }, { status: 400 });
  }
};
