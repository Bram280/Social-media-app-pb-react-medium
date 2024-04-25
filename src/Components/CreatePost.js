import { useContext, useEffect, useState } from "react";
import PocketBaseContext from "./PocketBaseContext";

const CreatePost = () => {
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [text, setText] = useState("");
    const [file, setFile] = useState(null)
    const [isPosting, setIsPosting] = useState(false);
    const pb = useContext(PocketBaseContext);

    async function post() {
        setIsPosting(true);
        // example create data
        const data = {
            "text": text,
            "user_created": pb.authStore.model.id,
        };

        if (file != null) {
            Object.assign(data, {"image" : file});
            document.getElementById("file").value = [];
        }

        const record = await pb.collection('posts').create(data);
        document.getElementById("post_text").value = "";
        setIsPosting(false);
    }

    return (  
        <div className="w-full flex justify-center">
            <div className="card w-11/12 xl:w-3/4 bg-base-100 shadow-xl">
                <div className="card-body flex justify-center w-full">
                    <h2 className="card-title">Make a post</h2>
                    <textarea id="post_text" placeholder="Your text here..." className="textarea textarea-bordered textarea-lg max-w-xl" onChange={(e) => {setText(e.target.value)}}></textarea>
                    <div className="flex justify-end">
                        <button className="border-2 border-neutral rounded-xl w-fit p-2 hover:bg-neutral hover:text-base-100" onClick={() => {setShowFileUpload(!showFileUpload)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                        </button>
                    </div>
                    {showFileUpload && 
                        <input id="file" type="file" className="file-input file-input-bordered w-full max-w-xs" accept="image/jpg|image/png" onChange={(e) => {setFile(e.target.files[0])}}/>
                    }
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary w-28" onClick={post} disabled={isPosting}>{!isPosting ? "Post" : <span className="loading loading-dots loading-md"></span>}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default CreatePost;