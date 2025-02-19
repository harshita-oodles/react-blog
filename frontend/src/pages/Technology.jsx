import React, { useEffect, useState } from "react";
import Blog from "../components/Blog";
import { GetContent } from "../services/GetContent";
import Loader from "../components/Loader";
import notfound1 from "../assets/notfound1.png";

const Technology = () => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  
  useEffect(() => {
    setLoading(true);
    GetContent.fetchAllBlogsByCategory("Technology").then((data) => {
      console.log("Fetched Data:", data);
      if (data && Array.isArray(data) && data.length > 0) {
        setBlogs(data);  // Set blogs if data is valid
      } else {
        setBlogs([]);  // Set empty array if no blogs
      }
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching blogs:", error);
      setBlogs([]);  // Clear blogs on error
      setLoading(false);
    });
  }, []);
 
  return (
    <>
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <Loader type={"bubbles"} color={"deepskyblue"} />
        </div>
      )}

      {!loading && blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <img src={notfound1} alt="No blogs found" />
          <div>
            <p className="text-4xl font-semibold text-center ">
              No blog entries found in{" "}
              <span className="text-primary">Technology</span> category!
            </p>
          </div>
        </div>
      ) : (
        blogs.map((blog) => {
          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10" key={blog.id}>
              <Blog
                id={blog.id}
                title={blog.title}
                content={blog.content}
                author_name={blog.author_name}
                author_bio={blog.author_bio}
                author_photo={blog.author_photo}
                date_created={blog.date_created}
                date_updated={blog.date_updated}
                image={blog.image}
                category={blog.category}
                total_likes={blog.total_likes}
                likes={blog.likes}
                reading_time={blog.reading_time}
                comment_count={blog.comment_count}
              />
            </div>
          );
        })
      )}
    </>
  );
};

export default Technology;