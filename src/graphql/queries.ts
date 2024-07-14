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

export const GET_SALE_BY_ID = gql`
  query GetStore($id: ID!) {
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
