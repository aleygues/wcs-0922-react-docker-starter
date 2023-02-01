import { gql } from "@apollo/client";

export const posts = gql`
  query Posts {
    posts {
      id
      content
      createdBy {
        id
        email
      }
      comments {
        id
        comment
        createdBy {
          id
          email
        }
        createdAt
      }
    }
  }
`;
