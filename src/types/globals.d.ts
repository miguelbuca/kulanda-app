// Scalars
type DateTime = string;

// Enums
enum AccessEnumType {
  SELLER = "SELLER",
  OWNER = "OWNER",
  MANAGER = "MANAGER",
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

enum PeriodReportStoreOptionsEnumType {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

// Types
interface UserType {
  id: string;
  fullName: string;
  username: string;
  phone: string;
  email: string;
  access: AccessEnumType;
  storeId?: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

interface AuthTokenType {
  access_token: string;
}

interface StoreType {
  id: string;
  address: string;
  designation: string;
  phone: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  products: ProductType[];
  sellers: UserType[];
  sales: SaleType[];
}

interface OrderType {
  id: string;
  saleId: string;
  productId: string;
  serviceId: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  products: ProductType[];
  services: ServiceType[];
}

interface SaleType {
  id: string;
  change?: number;
  code: number;
  cash?: number;
  bankCard?: number;
  totalPrice?: number;
  sellerId: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  orders: OrderType[];
  seller?: UserType;
}

interface ReportStoreType {
  totalSales?: number;
  sales?: SaleType[];
  totalSalesBalance?: number;
}

interface CompanyType {
  tenantId: string;
  id: string;
  nif: string;
  name: string;
  address: string;
  logo: string;
  caeId: string;
  stores: StoreType[];
  createdAt: DateTime;
  updatedAt: DateTime;
  cae: CAEType;
}

interface CAEType {
  id: string;
  name: string;
  code: number;
  sectorId: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  sector: SectorType;
}

interface ProductType {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  stock?: number;
  expiresOn: DateTime;
  categoryId: string;
  storeId: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  category: CategoryType;
  charges: ChargeType[];
}

interface CategoryType {
  id: string;
  name: string;
  description?: string;
  type: keyof typeof CategoryEnumType;
  charges: ChargeType[];
  createdAt: DateTime;
  updatedAt: DateTime;
}

interface ServiceType {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  categoryId: string;
  storeId: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  category: CategoryType;
  charges: ChargeType[];
}

interface SectorType {
  id: string;
  name: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

interface TenantCredentialsType {
  access_key: string;
}

interface ChargeType {
  id: string;
  name: string;
  acronym: string;
  percentage: number;
  type: keyof typeof ChargeEnumType;
  storeId?: string;
  categoryId?: string;
  serviceId?: string;
  productId?: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

interface ClientType {
  id: string;
  fullName: string;
  nif?: string;
  phone: string;
  email?: string;
  address: string;
  type?: ClientEnumType;
  caeId?: string;
  storeId?: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

// Inputs
interface ReportStoreOptionsInput {
  period?: PeriodReportStoreOptionsEnumType;
  from?: DateTime;
  sellerId?: string;
}

interface FilterProductInput {
  name?: string;
  categoryId?: string;
  paginate?: FilterProductPaginateInput;
}

interface FilterProductPaginateInput {
  page?: number;
  limit?: number;
}

interface FilterServiceInput {
  name?: string;
  categoryId?: string;
  paginate?: FilterServicePaginateInput;
}

interface FilterServicePaginateInput {
  page?: number;
  limit?: number;
}

interface CreateOrderSaleInput {
  productId?: string;
  serviceId?: string;
}

interface CreateCompanyInput {
  nif: string;
  name: string;
  address: string;
  logo?: string;
  caeId: string;
}
