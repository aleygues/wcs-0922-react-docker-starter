import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { IPost } from "../interfaces";
import { UserContext } from "../hooks/user.context";
import { posts } from "../graphql/posts";

export function Dashboard() {
  const { user, logout } = useContext(UserContext);
  const { data } = useQuery<{ posts: IPost[] }>(posts);

  return (
    <>
      <h1>Dashboard</h1>
      <p>Hello {user?.email}!</p>
      <h1>Last posts</h1>
      {data &&
        data.posts.map((post) => (
          <div>
            <p>{post.content}</p>
            <p>By {post.createdBy?.email}</p>
            <h4>Comments</h4>
            {post.comments.length === 0 ? (
              <p>No comment</p>
            ) : (
              post.comments.map((comment) => (
                <div>
                  <p>
                    {comment.comment}, {comment.createdAt} by{" "}
                    {comment.createdBy?.email}
                  </p>
                </div>
              ))
            )}
          </div>
        ))}
      <br />
      <br />
      <button onClick={logout}>Signout</button>
    </>
  );
}
