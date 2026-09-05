import { gql } from "@apollo/client";

export const ME = gql`
  query Me {
    me {
      id
      name
      email
      avatarDataUrl
    }
  }
`;

export const LOGIN = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      token
      user {
        id
        name
        email
        avatarDataUrl
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($data: RegisterInput!) {
    register(data: $data) {
      id
      name
      email
    }
  }
`;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarDataUrl?: string | null;
}
