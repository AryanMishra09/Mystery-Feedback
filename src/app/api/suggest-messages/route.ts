import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: Request) {
    try {
        const prompt = "Create a list of three open-ended and engaging question formatted as a single string. Each question should be seperated by '||'. These questions are for an anonyms social messaging platform like Qooh.me, and should be suitable for a diverse audiance. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction, For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."
    
        const result = streamText({
        model: openai('gpt-4o'),
        prompt,
        });
    
        return result.toDataStreamResponse();
    } catch (error) {
        console.log("An unexpected error occured: ", error);
        return Response.json({
            success: false,
            message: "Error",
        }, {status: 500})
    }
}