// Scalars
type DateTime = string;
type ID = string;
type Upload = File;

// Enums
enum AccessEnumType {
  SELLER = "SELLER",
  OWNER = "OWNER",
  MANAGER = "MANAGER",
}

enum StoreSaleEnumType {
  DEFAULT = "DEFAULT",
  PRODUCT = "PRODUCT",
  SERVICE = "SERVICE",
}

enum CategoryEnumType {
  PRODUCT = "PRODUCT",
  SERVICE = "SERVICE",
}

enum ChargeEnumType {
  TAX = "TAX",
  FEE = "FEE",
  DISCOUNT = "DISCOUNT",
}

enum ClientEnumType {
  INDIVIDUAL = "INDIVIDUAL",
  LEGAL = "LEGAL",
}

enum InvoiceEnumType {
  DRAFT = "DRAFT",
  ISSUED = "ISSUED",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

enum ReceiptEnumType {
  ISSUED = "ISSUED",
  PAID = "PAID",
}

enum CreditNoteEnumType {
  DRAFT = "DRAFT",
  ISSUED = "ISSUED",
  APPLIED = "APPLIED",
  CANCELLED = "CANCELLED",
}

enum SupplierEnumType {
  INDIVIDUAL = "INDIVIDUAL",
  LEGAL = "LEGAL",
}

enum PeriodReportStoreOptionsEnumType {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

// Types
type UserType = {
  id: ID;
  fullName: string;
  username: string;
  phone: string;
  email: string;
  access: AccessEnumType;
  storeId?: ID;
  createdAt: DateTime;
  updatedAt: DateTime;
};

type AuthTokenType = {
  access_token: string;
};

type StoreType = {
  id: ID;
  address: string;
  designation: string;
  phone: string;
  globalSale?: string;
  saleType?: keyof typeof StoreSaleEnumType;
  createdAt: DateTime;
  updatedAt: DateTime;
  products: ProductType[];
  sellers: UserType[];
  sales: SaleType[];
};

type OrderType = {
  id: ID;
  saleId: ID;
  productId?: ID;
  serviceId?: ID;
  createdAt: DateTime;
  updatedAt: DateTime;
  products: ProductType[];
  services: ServiceType[];
};

type SaleType = {
  id: ID;
  change?: number;
  code: number;
  cash?: number;
  bankCard?: number;
  totalPrice: number;
  sellerId: ID;
  clientId: ID;
  createdAt: DateTime;
  updatedAt: DateTime;
  orders: OrderType[];
  seller?: UserType;
  client?: ClientType;
};

type ReportStoreType = {
  totalSales: number;
  sales: SaleType[];
  totalSalesBalance: number;
};

type CompanyType = {
  tenantId: ID;
  id: ID;
  nif: string;
  name: string;
  address: string;
  logo: string;
  caeId: ID;
  stores: StoreType[];
  saftExportDate?: DateTime;
  createdAt: DateTime;
  updatedAt: DateTime;
  cae: CAEType;
};

type CAEType = {
  id: ID;
  name: string;
  code: number;
  sectorId: ID;
  createdAt: DateTime;
  updatedAt: DateTime;
  sector: SectorType;
};

type ProductType = {
  id: ID;
  name: string;
  description?: string;
  image?: string;
  price: number;
  expiresOn: DateTime;
  categoryId: ID;
  storeId: ID;
  createdAt: DateTime;
  updatedAt: DateTime;
  category: CategoryType;
  charges: ChargeType[];
};

type CategoryType = {
  id: ID;
  name: string;
  description?: string;
  type: CategoryEnumType;
  createdAt: DateTime;
  updatedAt: DateTime;
  charges: ChargeType[];
};

type ChargeType = {
  id: ID;
  name: string;
  acronym: string;
  percentage: number;
  type: ChargeEnumType;
  storeId?: ID;
  categoryId?: ID;
  serviceId?: ID;
  productId?: ID;
  createdAt: DateTime;
  updatedAt: DateTime;
};

type ServiceType = {
  id: ID;
  name: string;
  description?: string;
  image?: string;
  price: number;
  categoryId: ID;
  storeId: ID;
  createdAt: DateTime;
  updatedAt: DateTime;
  category: CategoryType;
  charges: ChargeType[];
};

type ClientType = {
  id: ID;
  fullName: string;
  nif?: string;
  phone: string;
  email?: string;
  address: string;
  type?: ClientEnumType;
  caeId?: ID;
  storeId?: ID;
  createdAt: DateTime;
  updatedAt: DateTime;
};

type SectorType = {
  id: ID;
  name: string;
  createdAt: DateTime;
  updatedAt: DateTime;
};

type TenantCredentialsType = {
  access_key: string;
};

type InvoiceType = {
  id: ID;
  number: number;
  amount: number;
  saleId: ID;
  digitalSignature: string;
  status: keyof typeof InvoiceEnumType;
  createdAt: DateTime;
  updatedAt: DateTime;
  sale: SaleType;
};

type ReceiptType = {
  id: ID;
  amount: number;
  number: number;
  digitalSignature: number;
  invoiceId: ID;
  status: ReceiptEnumType;
  createdAt: DateTime;
  updatedAt: DateTime;
  invoice: InvoiceType;
};

type CreditNoteType = {
  id: ID;
  number: number;
  amount: number;
  digitalSignature: string;
  invoiceId: ID;
  status: CreditNoteEnumType;
  createdAt: DateTime;
  updatedAt: DateTime;
  invoid: SaleType;
};

type SupplierType = {
  id: ID;
  fullName: string;
  nif?: string;
  phone: string;
  email?: string;
  address: string;
  type?: SupplierEnumType;
  storeId?: ID;
  caeId?: ID;
  createdAt: DateTime;
  updatedAt: DateTime;
};

// Inputs
type ReportStoreOptionsInput = {
  period?: PeriodReportStoreOptionsEnumType;
  from?: DateTime;
  sellerId?: ID;
};

type FilterProductInput = {
  name?: string;
  categoryId?: ID;
  paginate?: FilterProductPaginateInput;
};

type FilterProductPaginateInput = {
  page?: number;
  limit?: number;
};

type FilterServiceInput = {
  name?: string;
  categoryId?: ID;
  paginate?: FilterServicePaginateInput;
};

type FilterServicePaginateInput = {
  page?: number;
  limit?: number;
};

type FilterClientInput = {
  storeId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  paginate?: FilterClientPaginateInput;
};

type FilterClientPaginateInput = {
  page?: number;
  limit?: number;
};

type FilterSupplierInput = {
  storeId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  paginate?: FilterSupplierPaginateInput;
};

type FilterSupplierPaginateInput = {
  page?: number;
  limit?: number;
};

type CreateOrderSaleInput = {
  productId?: ID;
  serviceId?: ID;
};

type ProductSupplierInput = {
  supplierId: ID;
  quantity: number;
};

type CreateCompanyInput = {
  nif: string;
  name: string;
  address: string;
  logo?: Upload;
  caeId: ID;
  saftExportDate?: DateTime;
};
