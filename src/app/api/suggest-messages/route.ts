import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

// Create open ai client

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY
})

// Set the runtime to edge for best performence

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json()

        const prompt = "Create a list of three open-ended and engaging questions formetted as a single string. Each question should be seprated by '||'. These questions are for an anonymous social messanging platform, like Qooh.me and should be suitable for a diverse audience. Avoid personal and sensetive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this:'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that make you happy ?, Ensure the questions are intriguing, foster curiosity, contribute to a positive and welcoming controversional environment."

        // ask openai for a straming chat completions given prompt
        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            max_tokens:100,
            stream: true,
            prompt,
        })

        // Coverting response into friendly text-streame
        const streame = OpenAIStream(response)

        //Respond with the streame
        return new StreamingTextResponse(streame)
    } catch (error) {
        if(error instanceof OpenAI.APIError){
            const {name,status,headers,message} = error
            return NextResponse.json({name,status,headers,message},{status})
        }else{
            console.error(error)
            throw error
        }
    }
}