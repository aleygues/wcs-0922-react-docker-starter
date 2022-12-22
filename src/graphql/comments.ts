import { gql } from "@apollo/client";

export const comments = gql`
  query Comments {
    comments {
      id
      comment
      createdBy {
        email
      }
      createdAt
      distanceInDays
    }
  }
`;
