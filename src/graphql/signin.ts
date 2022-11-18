import { gql } from "@apollo/client";

export const signin = gql`
  mutation Signin($email: String!, $password: String!) {
    signin(email: $email, password: $password)
  }
`;
