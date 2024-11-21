-- CreateTable
CREATE TABLE "purchase" (
    "purchaseId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "creditCardNumber" TEXT NOT NULL,
    "creditCardExpiry" TEXT NOT NULL,
    "creditCardCVC" TEXT NOT NULL,
    "invoiceSubtotal" REAL NOT NULL,
    "invoiceTax" REAL NOT NULL,
    "invoiceTotal" REAL NOT NULL,
    "orderDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "purchaseItem" (
    "purchaseId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("purchaseId", "productId")
);
