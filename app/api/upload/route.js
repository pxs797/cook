import { GoogleGenerativeAI } from "@fuyun/generative-ai";

const BASE_URL = process.env.BASE_URL
const API_KEY = process.env.API_KEY

export async function POST(request) {
  const formData = await request.formData()
  const image = formData.get('image')
  const arrayBuffer = await image.arrayBuffer()
  const base64Img = Buffer.from(arrayBuffer).toString('base64')
  const genAI = new GoogleGenerativeAI(API_KEY, BASE_URL);    
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const prompt = "作为一名饮食营养师。我会给你一张食物图片，你会提供对食物分析，并根据该图片进行饮食建议。您应该只回复您的评论，而不是其他任何内容。不要写解释。";

  try {
    const result = await model.generateContent([prompt, {inlineData: { data: base64Img, mimeType: image.type }}]);
    const response = await result.response;
    const text = response.text();
    return Response.json({ code: 200, data: text })
  } catch (error) {
    return Response.json({ code: 500, error: '出错了，请稍后再试。' })
  }
}