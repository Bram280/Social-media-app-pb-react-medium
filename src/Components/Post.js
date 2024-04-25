import { useContext, useEffect, useState } from "react";
import PocketBaseContext from "./PocketBaseContext";

const Post = ({post}) => {
    //id, user, text, image, likes, created_at, parent_post, isLiked
    const id = post.id;
    const user = post.expand.user_created.name;
    const text = post.text;
    const image = post.image;
    const [likes, setLikes] = useState(post.likes);
    const created_at = post.created;
    const parent_post = post.parent_post;
    const [commentText, setCommentText] = useState("");
    const [isPostingComment, setIsPostingComment] = useState(false);
    let pb = useContext(PocketBaseContext);
    const [comments, setComments] = useState([]);
    const [postIsLiked, setPostIsLiked] = useState();
    const [postLikeId, setPostLikeId] = useState();

    async function postComment() {
        setIsPostingComment(true);
        // example create data
        const data = {
            "text": commentText,
            "user_created": pb.authStore.model.id,
            "parent_post": id,
        };

        const record = await pb.collection('posts').create(data);
        setIsPostingComment(false);
    }

    async function fetchComments(startPost, endPost) {
        // fetch a paginated records list
        const resultList = await pb.collection('posts').getList(startPost, endPost, { requestKey: null, sort: '-created', filter: `parent_post="${id}"`, expand: `likes_via_liked_post, user_created`});
        
        const updatedPosts = resultList.items.map(function(post) {
            // Modify the image property for each post
            // If there is an expand property, the post has likes
            let likes = ('likes_via_liked_post' in post.expand) ? post.expand.likes_via_liked_post.length : 0;
            return { ...post, likes: likes};
        });
        

        let resultPosts = [...comments, ...updatedPosts];
        console.log(resultPosts);
        setComments(resultPosts);
    }

        async function handleLike() {
        if (postIsLiked) {
            dislikePost();
        } else {
            likePost();
        }
    }

    async function dislikePost() {
        try {
            await pb.collection('likes').delete(postLikeId);
            setPostIsLiked(false);
            setLikes(prevLikes => prevLikes - 1);
        } catch(error) {
            console.error(error);
        }
    }

    async function likePost() {
        // example create data
        const data = {
            "liked_post": id,
            "user_created": pb.authStore.model.id,
        };

        try {
            const record = await pb.collection('likes').create(data);
            setPostIsLiked(true);
            setPostLikeId(record.id);
            setLikes(prevLikes => prevLikes + 1);
        } catch(error) {
            console.error("An error was thrown while trying to like the post");
        }
    }

    useEffect(() => {
        setPostIsLiked(() => {
            if (post.likes == 0) {
                return false;
            }
            for (let i = 0; i < likes; i++) {
                if (post.expand.likes_via_liked_post[i].user_created == pb.authStore.model.id) {
                    setPostLikeId(post.expand.likes_via_liked_post[i].id);
                    return true;
                }
            }
        });
    }, []);

    return ( 
        <div className="w-full flex justify-center m-1">
        <div className={"card shadow-xl min-w-fit " + ((parent_post == "") ? "w-11/12 xl:w-3/4 bg-base-100" : "w-11/12 bg-slate-50")}>
            <div className="card-body">
                <div>
                    <h1 className="card-title">{user || "Name"}</h1>
                    <h2 className="text-xs text-grey-50 opacity-50">Published on {created_at}</h2>
                </div>
                <p className="text-wrap text-ellipsis w-full overflow-hidden text-lg">{text}</p>
            </div>
            {image && <img className="h-52 object-contain" src={image} alt="Post image" />}
            <div className="flex justify-around m-2">
                <button onClick={() => {fetchComments(1,5)}} className="w-full flex justify-center rounded-lg p-2 hover:bg-slate-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                    </svg>

                </button>
                <button className="w-full flex justify-center rounded-lg p-2 hover:bg-slate-100" onClick={handleLike}>
                        <div className="flex gap-3">
                            {
                                postIsLiked ?
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                                </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                            </svg>
                            }
                        <h1>{likes}</h1>
                        </div>
                    </button>
            </div>
            <div className="flex w-full p-2 gap-2">
            <input type="text" placeholder="Add comment" className="input input-bordered grow" onChange={(e) => {setCommentText(e.target.value)}} value={!isPostingComment ? this : ""}/>
            <button className="btn btn-primary w-28" onClick={postComment} disabled={isPostingComment}>{!isPostingComment ? "Comment" : <span className="loading loading-dots loading-md"></span>}</button>

            </div>
            {comments.map((comment) => (
                <Post post={comment}/>
            ))}
        </div>
        
    </div>
     );
}
 
export default Post;