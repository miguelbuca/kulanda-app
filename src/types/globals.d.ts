// ------------------------------------------------------
// THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
// ------------------------------------------------------

type UserType = {
  id: string;
  fullName: string;
  username: string;
  phone: string;
  email: string;
  access: AccessEnumType;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
};

enum AccessEnumType {
  SELLER = 'SELLER',
  OWNER = 'OWNER',
  MANAGER = 'MANAGER'
}

type AuthTokenType = {
  access_token: string;
};

type StoreType = {
  id: string;
  address: string;
  designation: string;
  phone: string;
  globalSale?: string;
  saleType?: StoreSaleEnumType;
  createdAt: Date;
  updatedAt: Date;
  products: ProductType[];
  sellers: UserType[];
  sales: SaleType[];
};

enum StoreSaleEnumType {
  DEFAULT = 'DEFAULT',
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE'
}

type OrderType = {
  id: string;
  saleId: string;
  productId: string;
  serviceId: string;
  createdAt: Date;
  updatedAt: Date;
  products: ProductType[];
  services: ServiceType[];
};

type SaleType = {
  id: string;
  sellerId: string;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
  orders: OrderType[];
  seller?: UserType;
  client?: ClientType;
};

type ReportStoreType = {
  sales: SaleType[];
};

type CompanyType = {
  tenantId: string;
  id: string;
  nif: string;
  name: string;
  address: string;
  logo: string;
  caeId: string;
  stores: StoreType[];
  saftExportDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  cae: CAEType;
};

type CAEType = {
  id: string;
  name: string;
  code: number;
  sectorId: string;
  createdAt: Date;
  updatedAt: Date;
  sector: SectorType;
};

type ProductType = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  expiresOn?: Date;
  categoryId: string;
  storeId: string;
  createdAt: Date;
  updatedAt: Date;
  category: CategoryType;
  charges: ChargeType[];
  stock: SupplierOnProductType[];
};

type CategoryType = {
  id: string;
  name: string;
  description?: string;
  type: CategoryEnumType;
  createdAt: Date;
  updatedAt: Date;
  charges: ChargeType[];
};

enum CategoryEnumType {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE'
}

type ChargeType = {
  id: string;
  name: string;
  acronym: string;
  percentage: number;
  type: ChargeEnumType;
  storeId?: string;
  categoryId?: string;
  serviceId?: string;
  productId?: string;
  createdAt: Date;
  updatedAt: Date;
};

enum ChargeEnumType {
  TAX = 'TAX',
  FEE = 'FEE',
  DISCOUNT = 'DISCOUNT'
}

type SupplierOnProductType = {
  id: string;
  supplierId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: ProductType;
  supplier: SupplierType;
};

type ServiceType = {
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
  charges: ChargeType[];
};

type ClientType = {
  id: string;
  fullName: string;
  nif?: string;
  phone: string;
  email?: string;
  address: string;
  type?: ClientEnumType;
  caeId?: string;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
};

enum ClientEnumType {
  INDIVIDUAL = 'INDIVIDUAL',
  LEGAL = 'LEGAL'
}

type SectorType = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

type TenantCredentialsType = {
  access_key: string;
};

type InvoiceType = {
  id: string;
  number: number;
  amount: number;
  saleId: string;
  digitalSignature: string;
  status: InvoiceEnumType;
  createdAt: Date;
  updatedAt: Date;
  sale: SaleType;
};

enum InvoiceEnumType {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

type ReceiptType = {
  id: string;
  amount: number;
  number: number;
  digitalSignature: string;
  invoiceId: string;
  status: ReceiptEnumType;
  createdAt: Date;
  updatedAt: Date;
  invoice: InvoiceType;
};

enum ReceiptEnumType {
  ISSUED = 'ISSUED',
  PAID = 'PAID'
}

type CreditNoteType = {
  id: string;
  number: number;
  amount: number;
  digitalSignature: string;
  invoiceId: string;
  status: CreditNoteEnumType;
  createdAt: Date;
  updatedAt: Date;
  invoice: SaleType;
};

enum CreditNoteEnumType {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  APPLIED = 'APPLIED',
  CANCELLED = 'CANCELLED'
}

type SupplierType = {
  id: string;
  fullName: string;
  nif?: string;
  phone: string;
  email?: string;
  address: string;
  type: SupplierEnumType;
  storeId?: string;
  caeId?: string;
  createdAt: Date;
  updatedAt: Date;
};

enum SupplierEnumType {
  INDIVIDUAL = 'INDIVIDUAL',
  LEGAL = 'LEGAL'
}

type Query = {
  user: UserType;
  getUser(id: string): UserType;
  getUsers(storeId?: string): UserType[];
  getCompany(): CompanyType;
  getStores(): StoreType[];
  getStore(id: string): StoreType;
  getStoreReport(id: string, options: ReportStoreOptionsInput): ReportStoreType;
  getCategories(): CategoryType[];
  getCategory(id: string): CategoryType;
  getCategoriesByStore(storeId: string): CategoryType[];
  getProducts(storeId: string, filter: FilterProductInput): ProductType[];
  getProduct(id: string): ProductType;
  getServices(storeId: string, filter: FilterServiceInput): ServiceType[];
  getService(id: string): ServiceType;
  getSales(storeId: string): SaleType[];
  getSale(id: string): SaleType;
  getOrders(saleId: string): OrderType[];
  getOrder(id: string): OrderType;
  getSectors(): SectorType[];
  getSector(id: string): SectorType;
  getCAEs(): CAEType[];
  getCAE(id: string): CAEType;
  getCharges(): ChargeType[];
  getCharge(id: string): ChargeType;
  getChargesByStore(storeId: string): ChargeType[];
  getClients(filter: FilterClientInput): ClientType[];
  getClient(id: string): ClientType;
  getClientsByStore(storeId: string): ClientType[];
  getInvoices(): InvoiceType[];
  getInvoice(id: string): InvoiceType;
  sale: string;
  getReceipts(): ReceiptType[];
  getReceipt(id: string): ReceiptType;
  getCreditNotes(): CreditNoteType[];
  getCreditNote(id: string): CreditNoteType;
  getSuppliers(filter: FilterSupplierInput): SupplierType[];
  getSupplier(id: string): SupplierType;
  getSuppliersByStore(storeId: string): SupplierType[];
  getSupplierOnProducts(filter: FilterSupplierOnProductInput): SupplierOnProductType[];
  getSupplierOnProduct(id: string): SupplierOnProductType;
};

type ReportStoreOptionsInput = {
  period: PeriodReportStoreOptionsEnumType;
  from?: Date;
  sellerId?: string;
};

enum PeriodReportStoreOptionsEnumType {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR'
}

type FilterProductInput = {
  name?: string;
  categoryId?: string;
  paginate?: FilterProductPaginateInput;
};

type FilterProductPaginateInput = {
  page?: number;
  limit?: number;
};

type FilterServiceInput = {
  name?: string;
  categoryId?: string;
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
  caeId?: string;
  paginate?: FilterSupplierPaginateInput;
};

type FilterSupplierPaginateInput = {
  page?: number;
  limit?: number;
};

type FilterSupplierOnProductInput = {
  supplierId?: string;
  productId?: string;
  storeId?: string;
  paginate?: FilterSupplierOnProductPaginateInput;
};

type FilterSupplierOnProductPaginateInput = {
  page?: number;
  limit?: number;
};

type Mutation = {
  login(phone: string, password: string): AuthTokenType;
  createStore(input: CreateStoreInput): StoreType;
  updateStore(id: string, input: UpdateStoreInput): StoreType;
  deleteStore(id: string): StoreType;
  createProduct(input: CreateProductInput): ProductType;
  updateProduct(id: string, input: UpdateProductInput): ProductType;
  deleteProduct(id: string): ProductType;
  createCategory(input: CreateCategoryInput): CategoryType;
  updateCategory(id: string, input: UpdateCategoryInput): CategoryType;
  deleteCategory(id: string): CategoryType;
  createCharge(input: CreateChargeInput): ChargeType;
  updateCharge(id: string, input: UpdateChargeInput): ChargeType;
  deleteCharge(id: string): ChargeType;
  createClient(input: CreateClientInput): ClientType;
  updateClient(id: string, input: UpdateClientInput): ClientType;
  deleteClient(id: string): ClientType;
  createSale(input: CreateSaleInput): SaleType;
  updateSale(id: string, input: UpdateSaleInput): SaleType;
  deleteSale(id: string): SaleType;
  createOrder(input: CreateOrderInput): OrderType;
  updateOrder(id: string, input: UpdateOrderInput): OrderType;
  deleteOrder(id: string): OrderType;
  createSupplier(input: CreateSupplierInput): SupplierType;
  updateSupplier(id: string, input: UpdateSupplierInput): SupplierType;
  deleteSupplier(id: string): SupplierType;
  createSupplierOnProduct(input: CreateSupplierOnProductInput): SupplierOnProductType;
  updateSupplierOnProduct(id: string, input: UpdateSupplierOnProductInput): SupplierOnProductType;
  deleteSupplierOnProduct(id: string): SupplierOnProductType;
  createInvoice(input: CreateInvoiceInput): InvoiceType;
  updateInvoice(id: string, input: UpdateInvoiceInput): InvoiceType;
  deleteInvoice(id: string): InvoiceType;
  createCreditNote(input: CreateCreditNoteInput): CreditNoteType;
  updateCreditNote(id: string, input: UpdateCreditNoteInput): CreditNoteType;
  deleteCreditNote(id: string): CreditNoteType;
  createReceipt(input: CreateReceiptInput): ReceiptType;
  updateReceipt(id: string, input: UpdateReceiptInput): ReceiptType;
  deleteReceipt(id: string): ReceiptType;
};

type CreateStoreInput = {
  address: string;
  designation: string;
  phone: string;
  globalSale?: string;
  saleType: StoreSaleEnumType;
};

type UpdateStoreInput = {
  address?: string;
  designation?: string;
  phone?: string;
  globalSale?: string;
  saleType?: StoreSaleEnumType;
};

type CreateProductInput = {
  name: string;
  description?: string;
  image?: string;
  price: number;
  expiresOn?: Date;
  categoryId: string;
  storeId: string;
};

type UpdateProductInput = {
  name?: string;
  description?: string;
  image?: string;
  price?: number;
  expiresOn?: Date;
  categoryId?: string;
  storeId?: string;
};

type CreateCategoryInput = {
  name: string;
  description?: string;
  type: CategoryEnumType;
};

type UpdateCategoryInput = {
  name?: string;
  description?: string;
};

type CreateChargeInput = {
  name: string;
  acronym: string;
  percentage: number;
  type: ChargeEnumType;
  storeId?: string;
  categoryId?: string;
  productId?: string;
  serviceId?: string;
};

type UpdateChargeInput = {
  name?: string;
  acronym?: string;
  percentage?: number;
  type?: ChargeEnumType;
  storeId?: string;
  categoryId?: string;
  productId?: string;
  serviceId?: string;
};

type CreateClientInput = {
  fullName: string;
  nif?: string;
  phone: string;
  email?: string;
  address: string;
  type: ClientEnumType;
  caeId?: string;
  storeId?: string;
};

type UpdateClientInput = {
  fullName?: string;
  nif?: string;
  phone?: string;
  email?: string;
  address?: string;
  type?: ClientEnumType;
  caeId?: string;
  storeId?: string;
};

type CreateSupplierInput = {
  fullName: string;
  nif?: string;
  phone: string;
  email?: string;
  address: string;
  type: SupplierEnumType;
  caeId?: string;
  storeId?: string;
};

type UpdateSupplierInput = {
  fullName?: string;
  nif?: string;
  phone?: string;
  email?: string;
  address?: string;
  type?: SupplierEnumType;
  caeId?: string;
  storeId?: string;
};

type CreateSupplierOnProductInput = {
  supplierId: string;
  productId: string;
  quantity: number;
};

type UpdateSupplierOnProductInput = {
  supplierId?: string;
  productId?: string;
  quantity?: number;
};

type CreateSaleInput = {
  sellerId: string;
  clientId: string;
};

type UpdateSaleInput = {
  sellerId?: string;
  clientId?: string;
};

type CreateOrderInput = {
  saleId: string;
  productId: string;
  serviceId: string;
};

type UpdateOrderInput = {
  saleId?: string;
  productId?: string;
  serviceId?: string;
};

type CreateInvoiceInput = {
  number: number;
  amount: number;
  saleId: string;
  digitalSignature: string;
  status: InvoiceEnumType;
};

type UpdateInvoiceInput = {
  number?: number;
  amount?: number;
  saleId?: string;
  digitalSignature?: string;
  status?: InvoiceEnumType;
};

type CreateReceiptInput = {
  number: number;
  amount: number;
  invoiceId: string;
  digitalSignature: string;
  status: ReceiptEnumType;
};

type UpdateReceiptInput = {
  number?: number;
  amount?: number;
  invoiceId?: string;
  digitalSignature?: string;
  status?: ReceiptEnumType;
};

type CreateCreditNoteInput = {
  number: number;
  amount: number;
  digitalSignature: string;
  invoiceId: string;
  status: CreditNoteEnumType;
};

type UpdateCreditNoteInput = {
  number?: number;
  amount?: number;
  digitalSignature?: string;
  invoiceId?: string;
  status?: CreditNoteEnumType;
};
// ------------------------------------------------------
// THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
// ------------------------------------------------------

type UserType = {
  id: string;
  fullName: string;
  username: string;
  phone: string;
  email: string;
  access: AccessEnumType;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
};

enum AccessEnumType {
  SELLER = 'SELLER',
  OWNER = 'OWNER',
  MANAGER = 'MANAGER'
}

type AuthTokenType = {
  access_token: string;
};

type StoreType = {
  id: string;
  address: string;
  designation: string;
  phone: string;
  globalSale?: string;
  saleType?: StoreSaleEnumType;
  createdAt: Date;
  updatedAt: Date;
  products: ProductType[];
  sellers: UserType[];
  sales: SaleType[];
};

enum StoreSaleEnumType {
  DEFAULT = 'DEFAULT',
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE'
}

type OrderType = {
  id: string;
  saleId: string;
  productId: string;
  serviceId: string;
  createdAt: Date;
  updatedAt: Date;
  products: ProductType[];
  services: ServiceType[];
};

type SaleType = {
  id: string;
  sellerId: string;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
  orders: OrderType[];
  seller?: UserType;
  client?: ClientType;
};

type ReportStoreType = {
  sales: SaleType[];
};

type CompanyType = {
  tenantId: string;
  id: string;
  nif: string;
  name: string;
  address: string;
  logo: string;
  caeId: string;
  stores: StoreType[];
  saftExportDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  cae: CAEType;
};

type CAEType = {
  id: string;
  name: string;
  code: number;
  sectorId: string;
  createdAt: Date;
  updatedAt: Date;
  sector: SectorType;
};

type ProductType = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  expiresOn?: Date;
  categoryId: string;
  storeId: string;
  createdAt: Date;
  updatedAt: Date;
  category: CategoryType;
  charges: ChargeType[];
  stock: SupplierOnProductType[];
};

type CategoryType = {
  id: string;
  name: string;
  description?: string;
  type: CategoryEnumType;
  createdAt: Date;
  updatedAt: Date;
  charges: ChargeType[];
};

enum CategoryEnumType {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE'
}

type ChargeType = {
  id: string;
  name: string;
  acronym: string;
  percentage: number;
  type: ChargeEnumType;
  storeId?: string;
  categoryId?: string;
  serviceId?: string;
  productId?: string;
  createdAt: Date;
  updatedAt: Date;
};

enum ChargeEnumType {
  TAX = 'TAX',
  FEE = 'FEE',
  DISCOUNT = 'DISCOUNT'
}

type SupplierOnProductType = {
  id: string;
  supplierId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: ProductType;
  supplier: SupplierType;
};

type ServiceType = {
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
  charges: ChargeType[];
};

type ClientType = {
  id: string;
  fullName: string;
  nif?: string;
  phone: string;
  email?: string;
  address: string;
  type?: ClientEnumType;
  caeId?: string;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
};

enum ClientEnumType {
  INDIVIDUAL = 'INDIVIDUAL',
  LEGAL = 'LEGAL'
}

type SectorType = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

type TenantCredentialsType = {
  access_key: string;
};

type InvoiceType = {
  id: string;
  number: number;
  amount: number;
  saleId: string;
  digitalSignature: string;
  status: InvoiceEnumType;
  createdAt: Date;
  updatedAt: Date;
  sale: SaleType;
};

enum InvoiceEnumType {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

type ReceiptType = {
  id: string;
  amount: number;
  number: number;
  digitalSignature: string;
  invoiceId: string;
  status: ReceiptEnumType;
  createdAt: Date;
  updatedAt: Date;
  invoice: InvoiceType;
};

enum ReceiptEnumType {
  ISSUED = 'ISSUED',
  PAID = 'PAID'
}

type CreditNoteType = {
  id: string;
  number: number;
  amount: number;
  digitalSignature: string;
  invoiceId: string;
  status: CreditNoteEnumType;
  createdAt: Date;
  updatedAt: Date;
  invoice: SaleType;
};

enum CreditNoteEnumType {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  APPLIED = 'APPLIED',
  CANCELLED = 'CANCELLED'
}

type SupplierType = {
  id: string;
  fullName: string;
  nif?: string;
  phone: string;
  email?: string;
  address: string;
  type: SupplierEnumType;
  storeId?: string;
  caeId?: string;
  createdAt: Date;
  updatedAt: Date;
};

enum SupplierEnumType {
  INDIVIDUAL = 'INDIVIDUAL',
  LEGAL = 'LEGAL'
}

type ReportStoreOptionsInput = {
  period: PeriodReportStoreOptionsEnumType;
  from?: Date;
  sellerId?: string;
};

enum PeriodReportStoreOptionsEnumType {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR'
}

type FilterProductInput = {
  name?: string;
  categoryId?: string;
  paginate?: FilterProductPaginateInput;
};

type FilterProductPaginateInput = {
  page?: number;
  limit?: number;
};

type FilterServiceInput = {
  name?: string;
  categoryId?: string;
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
  caeId?: string;
  paginate?: FilterSupplierPaginateInput;
};

type FilterSupplierPaginateInput = {
  page?: number;
  limit?: number;
};

type FilterSupplierOnProductInput = {
  supplierId?: string;
  productId?: string;
  storeId?: string;
  paginate?: FilterSupplierOnProductPaginateInput;
};

type FilterSupplierOnProductPaginateInput = {
  page?: number;
  limit?: number;
};

type CreateStoreInput = {
  address: string;
  designation: string;
  phone: string;
  globalSale?: string;
  saleType: StoreSaleEnumType;
};

type UpdateStoreInput = {
  address?: string;
  designation?: string;
  phone?: string;
  globalSale?: string;
  saleType?: StoreSaleEnumType;
};

type CreateProductInput = {
  name: string;
  description?: string;
  image?: string;
  price: number;
  expiresOn?: Date;
  categoryId: string;
  storeId: string;
};

type UpdateProductInput = {
  name?: string;
  description?: string;
  image?: string;
  price?: number;
  expiresOn?: Date;
  categoryId?: string;
  storeId?: string;
};

type CreateCategoryInput = {
  name: string;
  description?: string;
  type: CategoryEnumType;
};

type UpdateCategoryInput = {
  name?: string;
  description?: string;
};

type CreateChargeInput = {
  name: string;
  acronym: string;
  percentage: number;
  type: ChargeEnumType;
  storeId?: string;
  categoryId?: string;
  productId?: string;
  serviceId?: string;
};

type UpdateChargeInput = {
  name?: string;
  acronym?: string;
  percentage?: number;
  type?: ChargeEnumType;
  storeId?: string;
  categoryId?: string;
  productId?: string;
  serviceId?: string;
};

type CreateClientInput = {
  fullName: string;
  nif?: string;
  phone: string;
  email?: string;
  address: string;
  type: ClientEnumType;
  caeId?: string;
  storeId?: string;
};

type UpdateClientInput = {
  fullName?: string;
  nif?: string;
  phone?: string;
  email?: string;
  address?: string;
  type?: ClientEnumType;
  caeId?: string;
  storeId?: string;
};

type CreateSupplierInput = {
  fullName: string;
  nif?: string;
  phone: string;
  email?: string;
  address: string;
  type: SupplierEnumType;
  caeId?: string;
  storeId?: string;
};

type UpdateSupplierInput = {
  fullName?: string;
  nif?: string;
  phone?: string;
  email?: string;
  address?: string;
  type?: SupplierEnumType;
  caeId?: string;
  storeId?: string;
};

type CreateSupplierOnProductInput = {
  supplierId: string;
  productId: string;
  quantity: number;
};

type UpdateSupplierOnProductInput = {
  supplierId?: string;
  productId?: string;
  quantity?: number;
};

type CreateSaleInput = {
  sellerId: string;
  clientId: string;
};

type UpdateSaleInput = {
  sellerId?: string;
  clientId?: string;
};

type CreateOrderInput = {
  saleId: string;
  productId: string;
  serviceId: string;
};

type UpdateOrderInput = {
  saleId?: string;
  productId?: string;
  serviceId?: string;
};

type CreateInvoiceInput = {
  number: number;
  amount: number;
  saleId: string;
  digitalSignature: string;
  status: InvoiceEnumType;
};

type UpdateInvoiceInput = {
  number?: number;
  amount?: number;
  saleId?: string;
  digitalSignature?: string;
  status?: InvoiceEnumType;
};

type CreateReceiptInput = {
  number: number;
  amount: number;
  invoiceId: string;
  digitalSignature: string;
  status: ReceiptEnumType;
};

type UpdateReceiptInput = {
  number?: number;
  amount?: number;
  invoiceId?: string;
  digitalSignature?: string;
  status?: ReceiptEnumType;
};

type CreateCreditNoteInput = {
  number: number;
  amount: number;
  digitalSignature: string;
  invoiceId: string;
  status: CreditNoteEnumType;
};

type UpdateCreditNoteInput = {
  number?: number;
  amount?: number;
  digitalSignature?: string;
  invoiceId?: string;
  status?: CreditNoteEnumType;
};
