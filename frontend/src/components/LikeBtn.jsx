import React from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";

const LikeBtn = ({ total_likes, handleLike, isLiked, handleUnlike }) => {
  return (
    <button
      className={`flex items-center gap-2 text-lg font-semibold cursor-pointer transition ${
        isLiked ? "text-blue-500 hover:text-blue-600" : "text-gray-400 hover:text-gray-300"
      } focus:outline-none`}
      onClick={isLiked ? handleUnlike : handleLike}
    >
      {isLiked ? (
        <AiFillLike className="text-blue-500 transition transform hover:scale-110" />
      ) : (
        <AiOutlineLike className="text-gray-400 transition transform hover:scale-110" />
      )}
      <p>{total_likes}</p>
    </button>
  );
};

export default LikeBtn;
