import React, { memo } from "react";
import { AiOutlineDeleteRow } from "react-icons/ai";

const Comment = ({ comment, handleDeleteComment, user }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { body, username, date_format, user_photo } = comment || {};

  const handleDelete = () => {
    handleDeleteComment(comment.id);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 px-6 py-4 rounded-lg shadow-md transition-all hover:shadow-lg">
      <div className="flex items-start justify-between">
        {/* User Avatar & Details */}
        <div className="flex gap-3">
          <img
            className="w-12 h-12 rounded-full object-cover mt-1 border border-gray-600"
            src={`${BASE_URL}${user_photo}`}
            alt="User Avatar"
          />
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-white">{username}</p>
            <p className="text-xs text-gray-400">{date_format}</p>
          </div>
        </div>

        {/* Delete Button (Only for Logged-in User) */}
        {user && user.username === username && (
          <button
            className="text-red-500 hover:text-red-600 transition-all text-lg"
            onClick={handleDelete}
          >
            <AiOutlineDeleteRow className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Comment Body */}
      <p className="pl-14 md:text-base text-gray-300 mt-2">{body}</p>
    </div>
  );
};

export default memo(Comment);
