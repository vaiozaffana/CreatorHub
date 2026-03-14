/*
  Warnings:

  - You are about to drop the `BankAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CreatorBalance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Disbursement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_userId_fkey";

-- DropForeignKey
ALTER TABLE "CreatorBalance" DROP CONSTRAINT "CreatorBalance_userId_fkey";

-- DropForeignKey
ALTER TABLE "Disbursement" DROP CONSTRAINT "Disbursement_userId_fkey";

-- DropTable
DROP TABLE "BankAccount";

-- DropTable
DROP TABLE "CreatorBalance";

-- DropTable
DROP TABLE "Disbursement";
