-- CreateTable
CREATE TABLE "area_config" (
    "id" SERIAL NOT NULL,
    "area" VARCHAR(255) NOT NULL,
    "districtid" INTEGER NOT NULL,
    "pincodes" VARCHAR(255) NOT NULL,

    CONSTRAINT "area_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "district_config" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),

    CONSTRAINT "district_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "mobile" VARCHAR(50) NOT NULL,
    "districts" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "power_cut_details" (
    "id" SERIAL NOT NULL,
    "shutDownDate" DATE NOT NULL,
    "town" VARCHAR(500) NOT NULL,
    "location" TEXT,
    "substation" VARCHAR(255) NOT NULL,
    "feeder" VARCHAR(255) NOT NULL,
    "area_ids" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "power_cut_details_pkey" PRIMARY KEY ("id")
);

