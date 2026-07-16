import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    tag:{
      type: String,
      require: false,
    },
    
    content: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    externalArticle:{
      type: Boolean,
      default: false
    },
    showInBlog: {
      type: Boolean,
      default: true
    },
    isQuote: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

//If the Post collection does not exist create a new one.
export default mongoose.models.Post || mongoose.model("Post", postSchema);
