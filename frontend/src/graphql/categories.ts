import { gql } from "@apollo/client";

export const CATEGORY_FIELDS = gql`
  fragment CategoryFields on Category {
    id
    title
    description
    icon
    color
    transactionCount
  }
`;

export const CATEGORIES = gql`
  ${CATEGORY_FIELDS}
  query Categories {
    categories {
      ...CategoryFields
    }
    categoryStats {
      totalCategories
      totalTransactions
      mostUsedCategory {
        ...CategoryFields
      }
    }
  }
`;

export const CREATE_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  mutation CreateCategory($data: CategoryInput!) {
    createCategory(data: $data) {
      ...CategoryFields
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  mutation UpdateCategory($id: ID!, $data: CategoryInput!) {
    updateCategory(id: $id, data: $data) {
      ...CategoryFields
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

export interface Category {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  transactionCount: number;
}

export interface CategoryStats {
  totalCategories: number;
  totalTransactions: number;
  mostUsedCategory: Category | null;
}
