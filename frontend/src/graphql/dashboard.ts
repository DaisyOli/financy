import { gql } from "@apollo/client";

export const DASHBOARD = gql`
  query Dashboard($month: String) {
    dashboard(month: $month) {
      month
      balanceInCents
      monthlyIncomeInCents
      monthlyExpensesInCents
      recentTransactions {
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
      categorySummaries {
        transactionCount
        totalInCents
        category {
          id
          title
          color
          icon
        }
      }
    }
  }
`;

export interface DashboardTransaction {
  id: string;
  description: string;
  type: "INCOME" | "EXPENSE";
  amountInCents: number;
  date: string;
  category: { id: string; title: string; color: string; icon: string };
}

export interface DashboardData {
  month: string;
  balanceInCents: number;
  monthlyIncomeInCents: number;
  monthlyExpensesInCents: number;
  recentTransactions: DashboardTransaction[];
  categorySummaries: Array<{
    transactionCount: number;
    totalInCents: number;
    category: { id: string; title: string; color: string; icon: string };
  }>;
}
