// Types and Enums
type UserType = {
  id?:  ID;
  fullName?:  String;
  username?:  String;
  phone?:  String;
  email?:  String;
  access?:  AccessEnumType;
  storeId?:  ID;
  createdAt?:  DateTime;
  updatedAt?:  DateTime;
};

enum AccessEnumType {
  SELLER,
  OWNER,
  MANAGER,
}

type AuthTokenType = {
  access_token?:  String;
};

type StoreType = {
  id?:  ID;
  address?:  String;
  designation?:  String;
  phone?:  String;
  globalSale?:  String;
  saleType?: keyof typeof StoreSaleEnumType;
  createdAt?:  DateTime;
  updatedAt?:  DateTime;
  products?:  ProductType[];
  sellers?:  UserType[];
  sales?:  SaleType[];
};

enum StoreSaleEnumType {
  DEFAULT,
  PRODUCT,
  SERVICE,
}

type OrderType = {
  id?:  ID;
  saleId?:  ID;
  creditNoteId?:  ID;
  debitNoteId?:  ID;
  productId?:  ID;
  serviceId?:  ID;
  createdAt?:  DateTime;
  updatedAt?:  DateTime;
  products?:  ProductType[];
  services?:  ServiceType[];
};

type SaleType = {
  id?:  ID;
  sellerId?:  ID;
  clientId?:  ID;
  createdAt?:  DateTime;
  updatedAt?:  DateTime;
  orders?:  OrderType[];
  seller?:  UserType;
  client?:  ClientType;
  invoice?:  InvoiceType;
};

type ReportStoreType = {
  sales?:  SaleType[];
  totalSales?:  Float;
  totalSalesBalance?:  Float;
};

type CompanyType = {
  tenantId?:  ID;
  id?:  ID;
  nif?:  String;
  name?:  String;
  address?:  String;
  fax?:  String;
  vatRegime?:  VatRegimeEnumType;
  logo?:  String;
  caeId?:  ID;
  stores?:  StoreType[];
  saftExportDate?:  DateTime;
  createdAt?:  DateTime;
  updatedAt?:  DateTime;
  cae?:  CAEType;
};

enum VatRegimeEnumType {
  GENERAL_REGIME,
  EXCLUSION_REGIME,
  SIMPLIFIED_REGIME,
}

type CAEType = {
  id?:  ID;
  name?:  String;
  code?:  Int;
  sectorId?:  ID;
  createdAt?:  DateTime;
  updatedAt?:  DateTime;
  sector?:  SectorType;
};

type ProductType = {
  id?:  ID;
  name?:  String;
  description?:  String;
  image?:  String;
  price?:  Float;
  code?:  Int;
  withholding?:  Boolean;
  categoryId?:  ID;
  storeId?:  ID;
  createdAt?:  DateTime;
  updatedAt?:  DateTime;
  category?:  CategoryType;
  charges?:  ChargeType[];
  stock?:  SupplierOnProductType[];
};

type CategoryType = {
  id?:  ID;
  name?:  String;
  description?:  String;
  type?: keyof typeof CategoryEnumType;
  createdAt?:  DateTime;
  updatedAt?:  DateTime;
  charges?:  ChargeType[];
};

enum CategoryEnumType {
  PRODUCT,
  SERVICE,
}

type ChargeType = {
  id?:  ID;
  name?:  String;
  acronym?:  String;
  percentage?:  Float;
  type?:  ChargeEnumType;
  storeId?:  ID;
  categoryId?:  ID;
  serviceId?:  ID;
  productId?:  ID;
  createdAt?:  DateTime;
  updatedAt?:  DateTime;
};

enum ChargeEnumType {
  TAX,
  FEE,
  DISCOUNT,
}

type SupplierOnProductType = {
  id?:  ID;
  supplierId?:  ID;
  productId?:  ID;
  quantity?:  Float;
  createdAt?:  DateTime;
  updatedAt?:  DateTime;
  product?:  ProductType;
  supplier?:  SupplierType;
};

type ServiceType = {
  id?:  ID;
  code?:  Float;
  name?:  String;
  description?:  String;
  price?:  Float;
  categoryId?:  ID;
  storeId?:  ID;
  createdAt?:  DateTime;
  updatedAt?:  DateTime;
  category?:  CategoryType;
  charges?:  ChargeType[];
};

type ClientType = {
  id?:  ID;
  fullName?:  String;
  nif?:  String;
  phone?:  String;
  email?:  String;
  address?:  String;
  type?:  ClientEnumType;
  caeId?:  ID;
  storeId?:  ID;
  createdAt?:  DateTime;
  updatedAt?:  DateTime;
};

enum ClientEnumType {
  INDIVIDUAL,
  LEGAL,
}

type InvoiceType = {
  id?:  ID;
  number?:  Int;
  amount?:  Float;
  saleId?:  ID;
  observation?:  String;
  retention?:  Float;
  digitalSignature?:  String;
  status?:  keyof typeof InvoiceEnumType;
  dueDate?:  DateTime;
  createdAt?:  DateTime;
  updatedAt?:  DateTime;
  sale?:  SaleType;
  receipt?:  ReceiptType;
};

enum InvoiceEnumType {
  DRAFT,
  ISSUED,
  PAID,
  OVERDUE,
  CANCELLED,
}

type SectorType = {
  id?:  ID;
  name?:  String;
  createdAt?:  DateTime;
  updatedAt?:  DateTime;
};

type TenantCredentialsType = {
  access_key?:  String;
};

type ReceiptType = {
  id?:  ID;
  amount?:  Float;
  number?:  Int;
  observation?:  String;
  dueDate?:  DateTime;
  digitalSignature?:  String;
  invoiceId?:  ID;
  status?:  keyof typeof ReceiptEnumType;
  createdAt?:  DateTime;
  updatedAt?:  DateTime;
  invoice?:  InvoiceType;
};

enum ReceiptEnumType {
  ISSUED,
  PAID,
}

type CreditNoteType = {
  id?:  ID;
  number?:  Int;
  amount?:  Float;
  digitalSignature?:  String;
  invoiceId?:  ID;
  status?:  keyof typeof CreditNoteEnumType;
  observation?:  String;
  retention?:  Float;
  dueDate?:  DateTime;
  createdAt?:  DateTime;
  updatedAt?:  DateTime;
  invoice?:  InvoiceType;
};

enum CreditNoteEnumType {
  DRAFT,
  ISSUED,
  APPLIED,
  CANCELLED,
}

type SupplierType = {
  id?:  ID;
  fullName?:  String;
  nif?:  String;
  phone?:  String;
  email?:  String;
  address?:  String;
  type?:  SupplierEnumType;
  storeId?:  ID;
  caeId?:  ID;
  createdAt?:  DateTime;
  updatedAt?:  DateTime;
};

enum SupplierEnumType {
  INDIVIDUAL,
  LEGAL,
}

type DebitNoteType = {
  id?:  ID;
  number?:  Int;
  amount?:  Float;
  digitalSignature?:  String;
  invoiceId?:  ID;
  status?:  keyof typeof DebitNoteEnumType;
  observation?:  String;
  retention?:  Float;
  dueDate?:  DateTime;
  createdAt?:  DateTime;
  updatedAt?:  DateTime;
  invoice?:  InvoiceType;
};

enum DebitNoteEnumType {
  DRAFT,
  ISSUED,
  APPLIED,
  CANCELLED,
}
