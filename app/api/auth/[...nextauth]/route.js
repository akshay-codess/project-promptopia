import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google'

import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        async session({ session }) {
            try {
                const sessionUser = await User.findOne({
                    email: session.user.email
                });

                if (sessionUser) {
                    session.user.id = sessionUser._id.toString();
                }

                return session; // This is crucial
            } catch (error) {
                console.error("Session callback error:", error);
                return session; // Return original session if there's an error
            }

        },
        async signIn({ profile }) {
            try {
                // serverless
                await connectToDB();

                // check if aa user already exists
                const userExist = await User.findOne({
                    email: profile.email
                })
                // if not create one

                console.log(profile.name, "sfsfsfs scvsd");
                if (!userExist) {

                    let username = profile.name
                        .replace(/[^a-zA-Z0-9]/g, '') // Remove non-alphanumeric characters
                        .toLowerCase();

                    // If the name is too short (like "Akshay" which is 6 chars)
                    if (username.length < 8) {
                        // Add the email prefix or a random string to reach 8 chars
                        const emailPrefix = profile.email.split('@')[0]
                            .replace(/[^a-zA-Z0-9]/g, ''); // Remove non-alphanumeric characters

                        // Combine name with email prefix
                        username = username + emailPrefix;

                        // If still too short, add random digits
                        while (username.length < 8) {
                            username += Math.floor(Math.random() * 10);
                        }
                    }

                    // Truncate if longer than 20 characters
                    if (username.length > 20) {
                        username = username.substring(0, 20);
                    }

                    // Final validation check
                    if (!/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(username)) {
                        // Create a simple valid username as fallback
                        username = 'user' + Math.random().toString(36).substring(2, 10);
                    }

                    console.log("Generated username:", username);
                    await User.create({
                        email: profile.email,
                        username: username,
                        image: profile.picture,
                    })
                }
                return true;
            } catch (error) {
                console.log(error);
                return false
            }

        }
    }
})

export { handler as GET, handler as POST };