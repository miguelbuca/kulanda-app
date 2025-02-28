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
      address
      cae {
        id
        name
      }
      stores {
        id
        designation
        address
        phone
        saleType
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
      saleType
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
      stock {
        id
        quantity
        supplier {
          id
          fullName
        }
      }
      category {
        type
      }
      charges {
        id
        name
        percentage
      }
      category {
        id
        name
        type
        charges {
          id
          name
          percentage
        }
      }
    }
  }
`;

export const GET_SERVICES_BY_STORE = gql`
  query getServices($storeId: ID!, $filter: FilterServiceInput) {
    getServices(storeId: $storeId, filter: $filter) {
      id
      name
      description
      price
      category {
        type
      }
      charges {
        id
        name
        percentage
      }
      category {
        id
        name
        type
        charges {
          id
          name
          percentage
        }
      }
    }
  }
`;

export const GET_SALE_BY_ID = gql`
  query GetSale($id: ID!) {
    getSale(id: $id) {
      id
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

export const GET_CLIENTS = gql`
  query GetClients($filter: FilterClientInput) {
    getClients(filter: $filter) {
      id
      fullName
      nif
      phone
      email
      address
      type
    }
  }
`;
export const GET_INVOICES = gql`
  query GetInvoices($filter: FilterInvoiceInput) {
    getInvoices(filter: $filter) {
      id
      number
      amount
      saleId
      observation
      retention
      status
      dueDate
      createdAt
      updatedAt
      sale {
        id
        client {
          id
          fullName
          nif
        }
        orders {
          id
          products {
            id
            price
            name
            code
            stock {
              id
              quantity
              supplier {
                id
                fullName
              }
            }
            category {
              id
              name
              type
              charges {
                id
                acronym
                percentage
              }
            }
            charges {
              id
              acronym
              percentage
            }
          }
          services {
            id
            price
            name
            code
            category {
              id
              name
              type
              charges {
                id
                acronym
                percentage
              }
            }
            charges {
              id
              acronym
              percentage
            }
          }
        }
      }
      receipt {
        id
        number
        status
      }
    }
  }
`;

export const GET_SUPPLIERS = gql`
  query GetSuppliers($filter: FilterSupplierInput) {
    getSuppliers(filter: $filter) {
      id
      fullName
      nif
      phone
      email
      address
      type
    }
  }
`;

export const GET_CLIENT_BY_ID = gql`
  query GetClient($id: ID!) {
    getClient(id: $id) {
      id
      fullName
      nif
      phone
      email
      address
      type
    }
  }
`;

export const GET_SUPPLIER_BY_ID = gql`
  query GetSupplier($id: ID!) {
    getSupplier(id: $id) {
      id
      fullName
      nif
      phone
      email
      address
      type
    }
  }
`;

export const GET_SALE_BY_STORE = gql`
  query GetSales($storeId: ID!) {
    getSales(storeId: $storeId) {
      client {
        id
        fullName
      }
      id
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
          price
          category {
            type
          }
        }
      }
      invoice {
        id
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

export const GET_SECTORS = gql`
  query GetSectors {
    getSectors {
      id
      name
    }
  }
`;

export const GET_CAES = gql`
  query GetCAEs {
    getCAEs {
      id
      name
      code
    }
  }
`;

export const GET_CHARGE_BY_ID = gql`
  query GetCharge($id: ID!) {
    getCharge(id: $id) {
      id
      name
      acronym
      percentage
      type
    }
  }
`;

export const GET_STORE_BY_ID = gql`
  query GetStore($id: ID!) {
    getStore(id: $id) {
      id
      address
      designation
      phone
      globalSale
      saleType
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      name
      image
      description
      price
      categoryId
      expiresOn
      stock {
        id
        quantity
        supplier {
          id
          fullName
        }
      }
      charges {
        id
        name
        percentage
      }
      category {
        id
        name
        type
        charges {
          id
          name
          percentage
        }
      }
    }
  }
`;

export const GET_SERVICE_BY_ID = gql`
  query GetService($id: ID!) {
    getService(id: $id) {
      id
      name
      description
      price
      categoryId
      charges {
        id
        name
        percentage
      }
      category {
        id
        name
        type
        charges {
          id
          name
          percentage
        }
      }
    }
  }
`;

export const GET_INVOICE = gql`
  query GetInvoice($id: ID!) {
    getInvoice(id: $id) {
      id
      amount
      status
      number
      createdAt
      updatedAt
      dueDate
      observation
      retention
      sale {
        id
        client {
          id
          nif
          fullName
          phone
          type
          address
        }
        seller {
          id
          fullName
          phone
        }
        orders {
          id
          products {
            id
            price
            name
            code
            category {
              id
              name
              charges {
                id
                acronym
                percentage
              }
            }
            charges {
              id
              acronym
              percentage
            }
          }
          services {
            id
            price
            name
            code
            category {
              id
              name
              charges {
                id
                acronym
                percentage
              }
            }
            charges {
              id
              acronym
              percentage
            }
          }
        }
      }
      receipt {
        id
        status
        amount
        number
      }
    }
  }
`;
