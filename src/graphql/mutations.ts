import { gql, useMutation } from "@apollo/client";

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      access_token
    }
  }
`;

export const CREATE_SALE = gql`
  mutation CreateSale($orders: [CreateOrderSaleInput!]!, $clientId: ID) {
    createSale(orders: $orders, clientId: $clientId) {
      id
    }
  }
`;

export const CREATE_INVOICE = gql`
  mutation CreateInvoice(
    $amount: Float!
    $saleId: ID!
    $status: InvoiceEnumType!
    $dueDate: DateTime!
    $observation: String
    $retention: Float
    $change: Float
  ) {
    createInvoice(
      amount: $amount
      saleId: $saleId
      status: $status
      dueDate: $dueDate
      observation: $observation
      retention: $retention
      change: $change
    ) {
      id
      status
      dueDate
      observation
      amount
    }
  }
`;

export const CREATE_RECEIPT = gql`
  mutation CreateReceipt(
    $invoiceId: ID!
    $status: ReceiptEnumType! = ISSUED
    $payments: [ReceiptPaymentInput!]!
    $observation: String
    $dueDate: DateTime!
    $amount: Float!
    $change: Float
  ) {
    createReceipt(
      payments: $payments
      invoiceId: $invoiceId
      status: $status
      observation: $observation
      dueDate: $dueDate
      amount: $amount
      change: $change
    ) {
      id
      invoiceId
    }
  }
`;

export const CREATE_DEBIT_NOTE = gql`
  mutation CreateDebitNote(
    $invoiceId: ID!
    $status: DebitNoteEnumType! = ISSUED
    $observation: String
    $retention: Float
    $dueDate: DateTime!
    $payments: [CreditNotePaymentInput!]!
    $amount: Float!
    $orders: [CreateOrderSaleInput!]!
    $change: Float
  ) {
    createDebitNote(
      payments: $payments
      invoiceId: $invoiceId
      status: $status
      observation: $observation
      dueDate: $dueDate
      amount: $amount
      retention: $retention
      orders: $orders
      change: $change
    ) {
      id
      invoiceId
    }
  }
`;

export const CREATE_CREDIT_NOTE = gql`
  mutation CreateCreditNote(
    $invoiceId: ID!
    $status: CreditNoteEnumType! = ISSUED
    $observation: String
    $retention: Float
    $dueDate: DateTime!
    $payments: [CreditNotePaymentInput!]!
    $amount: Float!
    $orders: [CreateOrderSaleInput!]!
    $change: Float
  ) {
    createCreditNote(
      payments: $payments
      invoiceId: $invoiceId
      status: $status
      observation: $observation
      dueDate: $dueDate
      amount: $amount
      retention: $retention
      orders: $orders
      change: $change
    ) {
      id
      invoiceId
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

export const CREATE_SUPPLIER = gql`
  mutation CreateSupplier(
    $fullName: String!
    $nif: String
    $phone: String!
    $email: String
    $address: String!
    $type: SupplierEnumType = INDIVIDUAL
    $caeId: ID
    $storeId: ID
  ) {
    createSupplier(
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

export const CREATE_STORE = gql`
  mutation CreateStore(
    $address: String!
    $designation: String!
    $phone: String!
    $globalSale: String
    $saleType: StoreSaleEnumType
  ) {
    createStore(
      address: $address
      designation: $designation
      phone: $phone
      globalSale: $globalSale
      saleType: $saleType
    ) {
      id
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $description: String
    $image: Upload
    $price: Float!
    $expiresOn: DateTime!
    $categoryId: ID!
    $charges: [ID!] = []
    $suppliers: [ProductSupplierInput!] = []
    $storeId: ID!
  ) {
    createProduct(
      name: $name
      description: $description
      image: $image
      price: $price
      expiresOn: $expiresOn
      categoryId: $categoryId
      charges: $charges
      suppliers: $suppliers
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
    $price: Float!
    $categoryId: ID!
    $charges: [ID!] = []
    $storeId: ID!
  ) {
    createService(
      name: $name
      description: $description
      price: $price
      categoryId: $categoryId
      charges: $charges
      storeId: $storeId
    ) {
      id
    }
  }
`;
