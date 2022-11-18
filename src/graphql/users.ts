import { gql } from "@apollo/client";

export const users = gql`
  query Users {
    users {
      id
      email
    }
  }
`;
