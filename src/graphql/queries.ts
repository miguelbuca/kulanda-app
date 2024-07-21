import { gql } from "@apollo/client";

export const GET_USER = gql`
  query User {
    user {
      id
      fullName
      email
      phone
      access
      storeId
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      fullName
      email
      phone
      access
      username
      storeId
    }
  }
`;

export const GET_COMPANY = gql`
  query GetCompany {
    getCompany {
      id
      nif
      name
      logo
      stores {
        id
        designation
        address
        phone
      }
    }
  }
`;

export const GET_STORE = gql`
  query GetStore($id: ID!) {
    getStore(id: $id) {
      id
      address
      designation
      phone
    }
  }
`;

export const GET_CATEGORIES_BY_STORE = gql`
  query GetStore($storeId: ID!) {
    getCategoriesByStore(storeId: $storeId) {
      id
      name
      description
      type
    }
  }
`;

export const GET_PRODUCTS_BY_STORE = gql`
  query GetProducts($storeId: ID!, $filter: FilterProductInput) {
    getProducts(storeId: $storeId, filter: $filter) {
      id
      name
      image
      description
      price
      stock
      category {
        id
        name
        type
      }
    }
  }
`;

export const GET_SERVICES_BY_STORE = gql`
  query getServices($storeId: ID!, $filter: FilterServiceInput) {
    getServices(storeId: $storeId, filter: $filter) {
      id
      name
      image
      description
      price
      category {
        id
        name
        type
      }
    }
  }
`;

export const GET_SALE_BY_ID = gql`
  query GetSale($id: ID!) {
    getSale(id: $id) {
      id
      change
      cash
      bankCard
      totalPrice
      seller {
        id
        fullName
        phone
      }
      orders {
        id
        products {
          id
          name
          description
          image
          price
          category {
            type
          }
        }
        services {
          id
          name
          description
          image
          price
          category {
            type
          }
        }
      }
    }
  }
`;

export const GET_STORE_REPORT = gql`
  query GetStoreReport($id: ID!, $options: ReportStoreOptionsInput) {
    getStoreReport(id: $id, options: $options) {
      totalSales
      totalSalesBalance
      sales {
        orders {
          id
          services {
            id
            name
            image
            category {
              id
              name
              type
            }
          }
          products {
            id
            name
            image
            category {
              id
              name
              type
            }
          }
        }
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
      description
      type
    }
  }
`;

export const GET_CATEGORY_BY_ID = gql`
  query GetCategory($id: ID!) {
    getCategory(id: $id) {
      id
      name
      description
      type
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      fullName
      email
      phone
      access
    }
  }
`;

export const GET_SALE_BY_STORE = gql`
  query GetSales($storeId: ID!) {
    getSales(storeId: $storeId) {
      id
      change
      cash
      bankCard
      totalPrice
      code
      seller {
        id
        fullName
        phone
      }
      orders {
        id
        products {
          id
          name
          description
          image
          price
          category {
            type
          }
        }
        services {
          id
          name
          description
          image
          price
          category {
            type
          }
        }
      }
    }
  }
`;

export const GET_CHARGES_BY_STORE = gql`
  query GetChargesByStore($storeId: ID!) {
    getChargesByStore(storeId: $storeId) {
      id
      name
      acronym
      percentage
      type
    }
  }
`;
