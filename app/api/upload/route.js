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

  const prompt = `
    作为一名经验丰富的营养师,你的任务是分析我提供的食物图片,并给出相关的饮食建议。
    如果图片中的内容不是食物,请直接说明图片中的内容,并告知无法提供饮食建议,不需要其他额外的内容或解释。
    如果图片中包含食物,请按照以下步骤进行分析和建议:
    第一步 - 识别图片中的食物。
    第二步 - 针对图片中的食物,分析其营养成分。
    第三步 - 根据营养成分分析,给出针对性的饮食建议,告诉我应该多吃哪些食物,少吃哪些,并解释原因。
  `

  try {
    const result = await model.generateContent([prompt, {inlineData: { data: base64Img, mimeType: image.type }}]);
    const response = await result.response;
    const text = response.text();
    return Response.json({ code: 200, data: text })
  } catch (error) {
    return Response.json({ code: 500, error: '出错了，请稍后再试。' })
  }
}