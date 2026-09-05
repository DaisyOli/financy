import { gql } from "@apollo/client";

export const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on Transaction {
    id
    description
    type
    amountInCents
    date
    category {
      id
      title
      color
      icon
    }
  }
`;

export const TRANSACTIONS = gql`
  ${TRANSACTION_FIELDS}
  query Transactions($filters: TransactionFiltersInput) {
    transactions(filters: $filters) {
      total
      page
      pageSize
      totalPages
      items {
        ...TransactionFields
      }
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  ${TRANSACTION_FIELDS}
  mutation CreateTransaction($data: TransactionInput!) {
    createTransaction(data: $data) {
      ...TransactionFields
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  ${TRANSACTION_FIELDS}
  mutation UpdateTransaction($id: ID!, $data: TransactionInput!) {
    updateTransaction(id: $id, data: $data) {
      ...TransactionFields
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;

export type TransactionType = "INCOME" | "EXPENSE";

export interface Transaction {
  id: string;
  description: string;
  type: TransactionType;
  amountInCents: number;
  date: string;
  category: { id: string; title: string; color: string; icon: string };
}

export interface TransactionPage {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  items: Transaction[];
}
