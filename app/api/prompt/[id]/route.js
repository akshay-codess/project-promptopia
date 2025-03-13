import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (req, { params }) => {

    try {
        await connectToDB();
        const realParam = await params;
        const prompt = await Prompt.findById(realParam.id);

        if (!prompt) return new Response("Prompt not found", { status: 404 });

        return new Response(JSON.stringify(prompt), { status: 200 })
    } catch (error) {
        console.log(error, "dfsefedfsdf")
        return new Response("Failed to fetch all posts", { status: 500 })
    }
}


// PATCH

export const PATCH = async (request, { params }) => {
    const { prompt, tag } = await request.json();
    try {
        await connectToDB();

        const realParam = await params;
        const existingPrompt = await Prompt.findById(realParam.id);

        if (!prompt) return new Response("Prompt not found", { status: 404 });
        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();
        return new Response(JSON.stringify(existingPrompt), { status: 200 })

    } catch (error) {
        return new Response("Failed to update the prompt", { status: 500 })
    }
}


//DELETE

export const DELETE = async (request, { params }) => {
    try {
        await connectToDB();
        const realParam = await params;

        await Prompt.findByIdAndDelete(realParam.id);

        return new Response("Prompt deleted Successfully", { status: 200 })
    } catch (error) {
        return new Response("Failed to Delete", { status: 500 })
    }
}