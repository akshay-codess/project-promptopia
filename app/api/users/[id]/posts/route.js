import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (request, { params }) => {

    try {
        await connectToDB();

        // Await the params object before accessing its properties
        const realParam = await params;

        const Prompts = await Prompt.find({
            creator: realParam.id
        }).populate('creator');

        return new Response(JSON.stringify(Prompts), { status: 201 })
    } catch (error) {
        return new Response("Failed to fetch user posts", { status: 500 })
    }
}