-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('on_offering', 'on_roasting', 'on_preparing', 'on_selling', 'end_of_sales');

-- CreateEnum
CREATE TYPE "WantRate" AS ENUM ('unrated', 'bad', 'so_so', 'good', 'excellent');

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "encrypted_password" TEXT NOT NULL DEFAULT '',
    "reset_password_token" TEXT,
    "reset_password_sent_at" TIMESTAMP(6),
    "remember_created_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "prefecture_code" TEXT NOT NULL DEFAULT '',
    "describe" TEXT,
    "image" TEXT,
    "roaster_id" BIGINT,
    "guest" BOOLEAN NOT NULL DEFAULT false,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "provider" TEXT NOT NULL DEFAULT 'email',
    "uid" TEXT NOT NULL DEFAULT '',
    "tokens" TEXT,
    "allow_password_change" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roasters" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "phone_number" TEXT NOT NULL DEFAULT '',
    "prefecture_code" TEXT NOT NULL DEFAULT '',
    "describe" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "image" TEXT,
    "address" TEXT NOT NULL DEFAULT '',
    "guest" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "roasters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beans" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT,
    "roaster_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "subregion" TEXT NOT NULL DEFAULT '',
    "farm" TEXT NOT NULL DEFAULT '',
    "variety" TEXT NOT NULL DEFAULT '',
    "elevation" INTEGER,
    "process" TEXT NOT NULL DEFAULT '',
    "cropped_at" DATE,
    "describe" TEXT,
    "acidity" INTEGER,
    "flavor" INTEGER,
    "body" INTEGER,
    "bitterness" INTEGER,
    "sweetness" INTEGER,
    "roast_level_id" BIGINT NOT NULL DEFAULT 0,
    "country_id" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "beans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bean_images" (
    "id" BIGSERIAL NOT NULL,
    "image" TEXT,
    "bean_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "bean_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mst_roast_levels" (
    "id" BIGINT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "mst_roast_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mst_countries" (
    "id" BIGINT NOT NULL,
    "name" TEXT,
    "area" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "mst_countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mst_taste_tags" (
    "id" BIGINT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "taste_group_id" BIGINT NOT NULL,

    CONSTRAINT "mst_taste_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bean_taste_tags" (
    "id" BIGSERIAL NOT NULL,
    "bean_id" BIGINT NOT NULL,
    "mst_taste_tag_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "bean_taste_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offers" (
    "id" BIGSERIAL NOT NULL,
    "bean_id" BIGINT NOT NULL,
    "ended_at" DATE NOT NULL,
    "roasted_at" DATE NOT NULL,
    "receipt_started_at" DATE NOT NULL,
    "receipt_ended_at" DATE NOT NULL,
    "price" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'on_offering',

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wants" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "offer_id" BIGINT NOT NULL,
    "receipted_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "rate" "WantRate" NOT NULL DEFAULT 'unrated',

    CONSTRAINT "wants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "offer_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roaster_relationships" (
    "id" BIGSERIAL NOT NULL,
    "follower_id" BIGINT NOT NULL,
    "roaster_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "roaster_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_reset_password_token_key" ON "users"("reset_password_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_uid_provider_key" ON "users"("uid", "provider");

-- CreateIndex
CREATE INDEX "roasters_prefecture_code_idx" ON "roasters"("prefecture_code");

-- CreateIndex
CREATE INDEX "beans_country_id_idx" ON "beans"("country_id");

-- CreateIndex
CREATE INDEX "beans_roast_level_id_idx" ON "beans"("roast_level_id");

-- CreateIndex
CREATE INDEX "beans_roaster_id_idx" ON "beans"("roaster_id");

-- CreateIndex
CREATE INDEX "beans_roaster_id_created_at_idx" ON "beans"("roaster_id", "created_at");

-- CreateIndex
CREATE INDEX "bean_images_bean_id_idx" ON "bean_images"("bean_id");

-- CreateIndex
CREATE INDEX "mst_taste_tags_taste_group_id_idx" ON "mst_taste_tags"("taste_group_id");

-- CreateIndex
CREATE INDEX "bean_taste_tags_bean_id_idx" ON "bean_taste_tags"("bean_id");

-- CreateIndex
CREATE INDEX "bean_taste_tags_mst_taste_tag_id_idx" ON "bean_taste_tags"("mst_taste_tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "bean_taste_tags_bean_id_mst_taste_tag_id_key" ON "bean_taste_tags"("bean_id", "mst_taste_tag_id");

-- CreateIndex
CREATE INDEX "offers_bean_id_idx" ON "offers"("bean_id");

-- CreateIndex
CREATE INDEX "offers_bean_id_created_at_ended_at_idx" ON "offers"("bean_id", "created_at", "ended_at");

-- CreateIndex
CREATE INDEX "wants_user_id_idx" ON "wants"("user_id");

-- CreateIndex
CREATE INDEX "wants_offer_id_idx" ON "wants"("offer_id");

-- CreateIndex
CREATE UNIQUE INDEX "wants_user_id_offer_id_key" ON "wants"("user_id", "offer_id");

-- CreateIndex
CREATE INDEX "likes_user_id_idx" ON "likes"("user_id");

-- CreateIndex
CREATE INDEX "likes_offer_id_idx" ON "likes"("offer_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_offer_id_key" ON "likes"("user_id", "offer_id");

-- CreateIndex
CREATE INDEX "roaster_relationships_follower_id_idx" ON "roaster_relationships"("follower_id");

-- CreateIndex
CREATE INDEX "roaster_relationships_roaster_id_idx" ON "roaster_relationships"("roaster_id");

-- CreateIndex
CREATE UNIQUE INDEX "roaster_relationships_follower_id_roaster_id_key" ON "roaster_relationships"("follower_id", "roaster_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roaster_id_fkey" FOREIGN KEY ("roaster_id") REFERENCES "roasters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beans" ADD CONSTRAINT "beans_roaster_id_fkey" FOREIGN KEY ("roaster_id") REFERENCES "roasters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beans" ADD CONSTRAINT "beans_roast_level_id_fkey" FOREIGN KEY ("roast_level_id") REFERENCES "mst_roast_levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beans" ADD CONSTRAINT "beans_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "mst_countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bean_images" ADD CONSTRAINT "bean_images_bean_id_fkey" FOREIGN KEY ("bean_id") REFERENCES "beans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bean_taste_tags" ADD CONSTRAINT "bean_taste_tags_bean_id_fkey" FOREIGN KEY ("bean_id") REFERENCES "beans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bean_taste_tags" ADD CONSTRAINT "bean_taste_tags_mst_taste_tag_id_fkey" FOREIGN KEY ("mst_taste_tag_id") REFERENCES "mst_taste_tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_bean_id_fkey" FOREIGN KEY ("bean_id") REFERENCES "beans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wants" ADD CONSTRAINT "wants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wants" ADD CONSTRAINT "wants_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roaster_relationships" ADD CONSTRAINT "roaster_relationships_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roaster_relationships" ADD CONSTRAINT "roaster_relationships_roaster_id_fkey" FOREIGN KEY ("roaster_id") REFERENCES "roasters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

