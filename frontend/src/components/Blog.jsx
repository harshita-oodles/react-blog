import React from "react";
import { Link } from "react-router-dom";
import { AiFillLike } from "react-icons/ai";
import { FaRegComments } from "react-icons/fa";
import { HiOutlineCalendar } from "react-icons/hi";
import { IoIosTimer } from "react-icons/io";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

const Blog = (props) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const {
    id,
    title,
    content,
    author_name,
    author_photo,
    date_created,
    image,
    category,
    total_likes,
    reading_time,
    comment_count,
  } = props;

  return (
    <div className="mx-5 my-10">
      <div className="rounded-2xl bg-gray-900 border-gray-800 border relative shadow-lg transition hover:shadow-xl">
        {/* Blog Image */}
        <div className="overflow-hidden rounded-t-2xl relative">
          <img
            className="hover:scale-105 transition duration-500 h-64 w-full object-cover"
            src={`${BASE_URL}${image}`}
            alt="Blog Cover"
          />
          {/* Category Tag */}
          <p className="absolute top-4 left-4 bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1 text-white rounded-2xl text-sm font-semibold">
            {category}
          </p>
        </div>

        {/* Author & Meta Information */}
        <div className="flex flex-wrap gap-4 md:justify-between px-4 pt-4">
          <div className="flex gap-3 items-center">
            <img
              className="w-10 h-10 object-cover rounded-full border border-gray-700"
              src={`${BASE_URL}${author_photo}`}
              alt="Author"
            />
            <p className="text-sm text-gray-300">{author_name}</p>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <HiOutlineCalendar className="text-blue-400 text-lg" />
            <p>{date_created}</p>
            <IoIosTimer className="text-purple-400 text-lg" />
            <p>{reading_time}</p>
          </div>
        </div>

        {/* Blog Title & Stats */}
        <div className="flex flex-col px-4 py-2">
          <div className="flex justify-between items-center">
            <p className="text-2xl font-semibold text-white hover:underline cursor-pointer line-clamp-1">
              <Link to={`/blog/${id}`}>{title}</Link>
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-1">
                <AiFillLike className="text-blue-400" />
                <p>{total_likes}</p>
              </div>
              <div className="flex items-center gap-1">
                <FaRegComments className="text-green-400" />
                <p>{comment_count}</p>
              </div>
            </div>
          </div>

          {/* Blog Content Preview */}
          <div className="text-gray-300 mt-2">
            <ReactQuill
              value={content.slice(0, 100).concat("...")}
              readOnly={true}
              theme={"bubble"}
            />
          </div>

          {/* Mobile 'Continue Reading' Button */}
          <Link to={`/blog/${id}`} className="md:hidden flex justify-center mt-4">
            <p className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-sm hover:scale-105 transition">
              Continue reading
            </p>
          </Link>
        </div>

        {/* Desktop 'Continue Reading' Button */}
        <button className="hidden md:flex absolute -bottom-4 left-1/3 bg-gradient-to-r from-cyan-600 to-blue-600 border-none text-white px-5 py-2 rounded-full text-sm font-semibold hover:scale-95 transition">
          <Link to={`/blog/${id}`}>Continue reading</Link>
        </button>
      </div>
    </div>
  );
};

export default Blog;
