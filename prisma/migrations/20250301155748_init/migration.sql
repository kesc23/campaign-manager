-- CreateEnum
CREATE TYPE "campaigns_status_enum" AS ENUM ('ativa', 'pausada', 'expirada');

-- CreateTable
CREATE TABLE "campaigns" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR NOT NULL,
    "dataCadastro" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataInicio" TIMESTAMP(6) NOT NULL,
    "dataFim" TIMESTAMP(6) NOT NULL,
    "status" "campaigns_status_enum" NOT NULL DEFAULT 'pausada',
    "categoria" VARCHAR NOT NULL,
    "dataExclusao" TIMESTAMP(6) NOT NULL,
    "excluido" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);
