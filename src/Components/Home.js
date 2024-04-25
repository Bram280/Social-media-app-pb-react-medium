import { useContext, useEffect, useState } from "react";
import PocketBaseContext from "./PocketBaseContext";
import CreatePost from "./CreatePost";
import Post from "./Post";
import Navbar from "./Navbar";


const Home = () => {
    const pb = useContext(PocketBaseContext);
    const [posts, setPosts] = useState([]);

    async function fetchPosts(startPost, endPost) {
        // fetch a paginated records list
        // Filter out comments aka no parent_post
        const resultList = await pb.collection('posts').getList(startPost, endPost, { requestKey: null, sort: '-created', filter: `parent_post=null`, expand: `likes_via_liked_post, user_created`});
        const updatedPosts = resultList.items.map(function(post) {
            // Modify the image property for each post
            // If there is an expand property, the post has likes
            let likes = ('likes_via_liked_post' in post.expand) ? post.expand.likes_via_liked_post.length : 0;
            return { ...post, image: pb.files.getUrl(post, post.image), likes: likes};
        });
        
        console.log(resultList.items);
        setPosts(updatedPosts);
    }

    useEffect(() => {
        fetchPosts(1, 5);
    }, []);


    return (  
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 py-5">
            <Navbar />
            <div className="flex flex-col justify-center items-center gap-3">
                <CreatePost />
                {posts.map((post) => (
                    <Post post={post}/>
                ))}
            </div>
            <div>

            </div>
        </div>
    );
}
 
export default Home;