import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (req, res) => {

    try {
        await connectToDB();
        const Prompts = await Prompt.find({}).populate('creator');

        return new Response(JSON.stringify(Prompts), { status: 201 })
    } catch (error) {
        return new Response("Failed to fetch all posts", { status: 500 })
    }
}