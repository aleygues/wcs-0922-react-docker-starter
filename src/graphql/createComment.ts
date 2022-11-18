import { gql } from "@apollo/client";

export const createComment = gql`
  mutation CreateComment($data: CommentInput!) {
    createComment(data: $data) {
      id
    }
  }
`;
