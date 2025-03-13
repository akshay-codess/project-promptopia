'use client'

import { useState, useEffect } from "react";
import { useSession } from "@node_modules/next-auth/react";
import { useRouter } from "@node_modules/next/navigation";

import Profile from '@components/Profile'

const MyProfile = () => {

    const router = useRouter();

    const { data: session, status } = useSession();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (status === 'loading') return; // Still loading session

                if (!session?.user?.id) {
                    // Handle unauthenticated state
                    console.log('User not authenticated');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`/api/users/${session.user.id}/posts`);
                const data = await response.json();

                setPosts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [session, status]);
    const handleEdit = (post) => {
        router.push(`/update-prompt?id=${post._id}`);

    }
    const handleDelete = async (post) => {

        const hasConfirmed = confirm("Are you sure want to delete this prompt?");
        if (hasConfirmed) {
            try {
                await fetch(`/api/prompt/${post._id.toString()}`, {
                    method: 'Delete'
                })

                const filteredPosts = posts.filter((p) => p._id !== post._id);
                setPosts(filteredPosts);
            } catch (error) {

            }
        }

    }
    return (
        <Profile
            name={"My"}
            desc="Welcome to your personalized profile page"
            data={posts}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
        />
    )
}

export default MyProfile;