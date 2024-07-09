import { gql, useMutation } from "@apollo/client";

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      access_token
    }
  }
`;

export const CREATE_SALE = gql`
  mutation CreateSale(
    $change: Float
    $cash: Float
    $bankCard: Float
    $totalPrice: Float
    $orders: [CreateOrderSaleInput!]!
  ) {
    createSale(
      change: $change
      cash: $cash
      bankCard: $bankCard
      totalPrice: $totalPrice
      orders: $orders
    ) {
      id
      change
      cash
      bankCard
      totalPrice
      createdAt
    }
  }
`;
