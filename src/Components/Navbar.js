import { useContext } from "react";
import PocketBaseContext from "./PocketBaseContext";

const Navbar = () => {
    const pb = useContext(PocketBaseContext);
    return (  
        <div className="flex flex-col h-fit bg-white w-fit mx-auto mb-2 xl:mb-0 xl:ml-auto xl:mx-0 shadow-xl rounded-2xl">
        <button className="flex items-center gap-3 px-5 py-2 rounded-lg hover:bg-slate-100">
            <div className="avatar">
                <div className="w-20 rounded-full">
                    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
            </div>
            <h1 className="text-2xl">{pb.authStore.model.name}</h1>
        </button>
    </div>
    );
}
 
export default Navbar;