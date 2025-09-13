// Constantes com mapeamentos das colunas para garantir desacoplamento da DB
export const UserFields = {
  ID: "id",
  NAME: "name",
  EMAIL: "email",
  EMAIL_VERIFIED: "emailVerified",
  IMAGE: "image",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
} as const;

export const SessionFields = {
  ID: "id",
  EXPIRES_AT: "expiresAt",
  TOKEN: "token",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
  IP_ADDRESS: "ipAddress",
  USER_AGENT: "userAgent",
  USER_ID: "userId",
} as const;

export const AccountFields = {
  ID: "id",
  ACCOUNT_ID: "accountId",
  PROVIDER_ID: "providerId",
  USER_ID: "userId",
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  ID_TOKEN: "idToken",
  ACCESS_TOKEN_EXPIRES_AT: "accessTokenExpiresAt",
  REFRESH_TOKEN_EXPIRES_AT: "refreshTokenExpiresAt",
  SCOPE: "scope",
  PASSWORD: "password",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
} as const;

export const VerificationFields = {
  ID: "id",
  IDENTIFIER: "identifier",
  VALUE: "value",
  EXPIRES_AT: "expiresAt",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
} as const;

export const CategoryFields = {
  ID: "id",
  NAME: "name",
  SLUG: "slug",
  CREATED_AT: "createdAt",
} as const;

export const ProductFields = {
  ID: "id",
  CATEGORY_ID: "categoryId",
  NAME: "name",
  SLUG: "slug",
  DESCRIPTION: "description",
  WIDTH_IN_CENTIMETERS: "widthInCentimeters",
  HEIGHT_IN_CENTIMETERS: "heightInCentimeters",
  LENGTH_IN_CENTIMETERS: "lengthInCentimeters",
  WEIGHT_IN_GRAMS: "weightInGrams",
  CREATED_AT: "createdAt",
} as const;

export const ProductVariantFields = {
  ID: "id",
  PRODUCT_ID: "productId",
  NAME: "name",
  SLUG: "slug",
  COLOR: "color",
  PRICE_IN_CENTS: "priceInCents",
  IMAGE_URL: "imageUrl",
  QUANTITY_IN_STOCK: "quantityInStock",
  CREATED_AT: "createdAt",
} as const;

export const ShippingAddressFields = {
  ID: "id",
  USER_ID: "userId",
  RECIPIENT_NAME: "recipientName",
  STREET: "street",
  NUMBER: "number",
  COMPLEMENT: "complement",
  CITY: "city",
  STATE: "state",
  NEIGHBORHOOD: "neighborhood",
  ZIP_CODE: "zipCode",
  COUNTRY: "country",
  PHONE: "phone",
  EMAIL: "email",
  CPF_OR_CNPJ: "cpfOrCnpj",
  CREATED_AT: "createdAt",
} as const;

export const CartFields = {
  ID: "id",
  USER_ID: "userId",
  SHIPPING_ADDRESS_ID: "shippingAddressId",
  CREATED_AT: "createdAt",
} as const;

export const CartItemFields = {
  ID: "id",
  CART_ID: "cartId",
  PRODUCT_VARIANT_ID: "productVariantId",
  QUANTITY: "quantity",
  CREATED_AT: "createdAt",
} as const;

export const DirectBuyPretensionFields = {
  ID: "id",
  PRODUCT_VARIANT_ID: "productVariantId",
  USER_ID: "userId",
  QUANTITY: "quantity",
  PRICE_IN_CENTS: "priceInCents",
  CREATED_AT: "createdAt",
} as const;

export const OrderFields = {
  ID: "id",
  USER_ID: "userId",
  SHIPPING_ADDRESS_ID: "shippingAddressId",
  RECIPIENT_NAME: "recipientName",
  STREET: "street",
  NUMBER: "number",
  COMPLEMENT: "complement",
  CITY: "city",
  STATE: "state",
  NEIGHBORHOOD: "neighborhood",
  ZIP_CODE: "zipCode",
  COUNTRY: "country",
  PHONE: "phone",
  EMAIL: "email",
  CPF_OR_CNPJ: "cpfOrCnpj",
  SUBTOTAL_PRICE_IN_CENTS: "subtotalPriceInCents",
  SHIPPING_COST_IN_CENTS: "shippingCostInCents",
  TOTAL_PRICE_IN_CENTS: "totalPriceInCents",
  STATUS: "status",
  CHECKOUT_SESSION_ID: "checkoutSessionId",
  CHECKOUT_SESSION_URL: "checkoutSessionUrl",
  CREATED_AT: "createdAt",
} as const;

export const OrderItemFields = {
  ID: "id",
  ORDER_ID: "orderId",
  PRODUCT_VARIANT_ID: "productVariantId",
  QUANTITY: "quantity",
  PRICE_IN_CENTS: "priceInCents",
  CREATED_AT: "createdAt",
} as const;
