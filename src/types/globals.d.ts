interface UserType {
  id: string;
  fullName: string;
  username: string;
  phone: string;
  email: string;
  access: keyof typeof AccessEnumType;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
  companies: CompanyType[];
}

enum AccessEnumType {
  SELLER = "SELLER",
  OWNER = "OWNER",
  MANAGER = "MANAGER",
}

interface StoreType {
  id: string;
  address: string;
  designation: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  products: ProductType[];
  sellers: UserType[];
  sales: SaleType[];
}

interface OrderType {
  id: string;
  saleId: string;
  productId?: string;
  serviceId?: string;
  createdAt: Date;
  updatedAt: Date;
  products: ProductType[];
  services: ServiceType[];
}

interface SaleType {
  id: string;
  change?: number;
  cash?: number;
  bankCard?: number;
  totalPrice?: number;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
  orders: OrderType[];
  seller?: UserType;
}

interface ReportStoreType {
  totalSales?: number;
  sales: SaleType[];
  totalSalesBalance?: number;
}

interface CompanyType {
  id: string;
  nif: string;
  name: string;
  address: string;
  logo: string;
  caeId: string;
  stores: StoreType[];
  createdAt: Date;
  updatedAt: Date;
  cae: CAEType;
}

interface AuthTokenType {
  access_token: string;
}

interface CAEType {
  id: string;
  name: string;
  code: number;
  sectorId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductType {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  stock?: number;
  expiresOn: Date;
  categoryId: string;
  storeId: string;
  createdAt: Date;
  updatedAt: Date;
  category: CategoryType;
}

interface CategoryType {
  id: string;
  name: string;
  description?: string;
  type: keyof typeof CategoryEnumType;
  createdAt: Date;
  updatedAt: Date;
}

enum CategoryEnumType {
  PRODUCT = "PRODUCT",
  SERVICE = "SERVICE",
}

interface ServiceType {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  categoryId: string;
  storeId: string;
  createdAt: Date;
  updatedAt: Date;
  category: CategoryType;
}

interface SectorType {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ReportStoreOptionsInput {
  period?: keyof typeof PeriodReportStoreOptionsEnumType;
  from?: Date;
  sellerId?: string;
}

enum PeriodReportStoreOptionsEnumType {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR",
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
