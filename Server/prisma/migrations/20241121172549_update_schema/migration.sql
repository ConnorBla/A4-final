-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_purchase" (
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
    "invoiceSubtotal" TEXT NOT NULL,
    "invoiceTax" TEXT NOT NULL,
    "invoiceTotal" TEXT NOT NULL,
    "orderDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_purchase" ("city", "country", "creditCardCVC", "creditCardExpiry", "creditCardNumber", "customerId", "invoiceSubtotal", "invoiceTax", "invoiceTotal", "orderDate", "postalCode", "province", "purchaseId", "street") SELECT "city", "country", "creditCardCVC", "creditCardExpiry", "creditCardNumber", "customerId", "invoiceSubtotal", "invoiceTax", "invoiceTotal", "orderDate", "postalCode", "province", "purchaseId", "street" FROM "purchase";
DROP TABLE "purchase";
ALTER TABLE "new_purchase" RENAME TO "purchase";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
