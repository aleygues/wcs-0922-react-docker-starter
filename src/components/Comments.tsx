import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { IComment, IUser } from "../interfaces";
import { comments } from "../graphql/comments";
import { createComment } from "../graphql/createComment";
import { Comment } from "./Comment";
import { UserContext } from "../hooks/user.context";

export function Comments() {
  const userContext = useContext(UserContext);
  const [comment, setComment] = useState("");
  const { data } = useQuery<{ comments: IComment[] }>(comments);
  const [doCreateComment] = useMutation(createComment, {
    refetchQueries: [comments],
  });

  async function sendComment() {
    try {
      await doCreateComment({
        variables: {
          data: {
            comment,
          },
        },
      });
      setComment("");
    } catch {}
  }

  return (
    <>
      {data?.comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onDelete={() => {
            console.log("Should delete");
          }}
        />
      ))}
      <hr />
      <p>{userContext.user?.email} you can write some comments:</p>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={sendComment}>Send!</button>
    </>
  );
}
