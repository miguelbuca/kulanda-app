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
    $clientId: ID
  ) {
    createSale(
      change: $change
      cash: $cash
      bankCard: $bankCard
      totalPrice: $totalPrice
      orders: $orders
      clientId: $clientId
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

export const CREATE_USER = gql`
  mutation SignUp(
    $fullName: String!
    $username: String
    $email: String!
    $phone: String
    $access: AccessEnumType = SELLER
    $storeId: ID!
    $password: String!
  ) {
    signUp(
      fullName: $fullName
      username: $username
      email: $email
      phone: $phone
      access: $access
      password: $password
      storeId: $storeId
    ) {
      access_token
    }
  }
`;

export const CREATE_CLIENT = gql`
  mutation CreateClient(
    $fullName: String!
    $nif: String
    $phone: String!
    $email: String
    $address: String!
    $type: ClientEnumType = INDIVIDUAL
    $caeId: ID
    $storeId: ID
  ) {
    createClient(
      fullName: $fullName
      nif: $nif
      phone: $phone
      email: $email
      address: $address
      type: $type
      caeId: $caeId
      storeId: $storeId
    ) {
      id
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory(
    $name: String!
    $description: String
    $type: CategoryEnumType!
  ) {
    createCategory(name: $name, description: $description, type: $type) {
      id
    }
  }
`;

export const CREATE_CHARGE = gql`
  mutation CreateCharge(
    $name: String!
    $acronym: String!
    $percentage: Float!
    $type: ChargeEnumType!
    $storeId: ID!
  ) {
    createCharge(
      storeId: $storeId
      name: $name
      acronym: $acronym
      percentage: $percentage
      type: $type
    ) {
      id
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $description: String
    $image: String
    $price: Float!
    $stock: Int
    $expiresOn: DateTime!
    $categoryId: ID!
    $charges: [ID!] = []
    $storeId: ID!
  ) {
    createProduct(
      name: $name
      description: $description
      image: $image
      price: $price
      stock: $stock
      expiresOn: $expiresOn
      categoryId: $categoryId
      charges: $charges
      storeId: $storeId
    ) {
      id
    }
  }
`;

export const CREATE_SERVICE = gql`
  mutation CreateService(
    $name: String!
    $description: String
    $image: String
    $price: Float!
    $categoryId: ID!
    $charges: [ID!] = []
    $storeId: ID!
  ) {
    createService(
      name: $name
      description: $description
      image: $image
      price: $price
      categoryId: $categoryId
      charges: $charges
      storeId: $storeId
    ) {
      id
    }
  }
`;
