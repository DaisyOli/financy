import { gql } from "@apollo/client";

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($data: UpdateProfileInput!) {
    updateProfile(data: $data) {
      id
      name
      email
      avatarDataUrl
    }
  }
`;

export const UPDATE_AVATAR = gql`
  mutation UpdateAvatar($avatarDataUrl: String) {
    updateAvatar(avatarDataUrl: $avatarDataUrl) {
      id
      name
      email
      avatarDataUrl
    }
  }
`;
