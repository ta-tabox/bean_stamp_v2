# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2023_01_08_142634) do

  create_table "bean_images", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "image"
    t.bigint "bean_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["bean_id"], name: "index_bean_images_on_bean_id"
  end

  create_table "bean_taste_tags", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "bean_id", null: false
    t.bigint "mst_taste_tag_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["bean_id", "mst_taste_tag_id"], name: "index_bean_taste_tags_on_bean_id_and_mst_taste_tag_id"
    t.index ["bean_id"], name: "index_bean_taste_tags_on_bean_id"
    t.index ["mst_taste_tag_id"], name: "index_bean_taste_tags_on_mst_taste_tag_id"
  end

  create_table "beans", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.bigint "roaster_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "subregion", default: "", null: false
    t.string "farm", default: "", null: false
    t.string "variety", default: "", null: false
    t.integer "elevation"
    t.string "process", default: "", null: false
    t.date "cropped_at"
    t.text "describe"
    t.integer "acidity"
    t.integer "flavor"
    t.integer "body"
    t.integer "bitterness"
    t.integer "sweetness"
    t.bigint "roast_level_id", default: 0
    t.bigint "country_id", default: 0
    t.index ["country_id"], name: "index_beans_on_country_id"
    t.index ["roast_level_id"], name: "index_beans_on_roast_level_id"
    t.index ["roaster_id", "created_at"], name: "index_beans_on_roaster_id_and_created_at"
    t.index ["roaster_id"], name: "index_beans_on_roaster_id"
  end

  create_table "likes", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "offer_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["offer_id"], name: "index_likes_on_offer_id"
    t.index ["user_id", "offer_id"], name: "index_likes_on_user_id_and_offer_id", unique: true
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "mst_countries", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.string "area"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "mst_roast_levels", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "mst_taste_tags", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "taste_group_id", null: false
    t.index ["taste_group_id"], name: "index_mst_taste_tags_on_taste_group_id"
  end

  create_table "offers", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "bean_id", null: false
    t.date "ended_at", null: false
    t.date "roasted_at", null: false
    t.date "receipt_started_at", null: false
    t.date "receipt_ended_at", null: false
    t.integer "price", null: false
    t.integer "weight", null: false
    t.integer "amount", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "status", default: 0, null: false
    t.index ["bean_id", "created_at", "ended_at"], name: "index_offers_on_bean_id_and_created_at_and_ended_at"
    t.index ["bean_id"], name: "index_offers_on_bean_id"
  end

  create_table "roaster_relationships", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "follower_id", null: false
    t.bigint "roaster_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["follower_id", "roaster_id"], name: "index_roaster_relationships_on_follower_id_and_roaster_id", unique: true
    t.index ["follower_id"], name: "index_roaster_relationships_on_follower_id"
    t.index ["roaster_id"], name: "index_roaster_relationships_on_roaster_id"
  end

  create_table "roasters", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", default: "", null: false
    t.string "phone_number", default: "", null: false
    t.string "prefecture_code", default: "", null: false
    t.text "describe"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "image"
    t.string "address", default: "", null: false
    t.boolean "guest", default: false
    t.index ["prefecture_code"], name: "index_roasters_on_prefecture_code"
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "name", default: "", null: false
    t.string "prefecture_code", default: ""
    t.text "describe"
    t.string "image"
    t.bigint "roaster_id"
    t.boolean "guest", default: false
    t.boolean "admin", default: false
    t.string "provider", default: "email", null: false
    t.string "uid", default: "", null: false
    t.text "tokens"
    t.boolean "allow_password_change", default: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["roaster_id"], name: "index_users_on_roaster_id"
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

  create_table "wants", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "offer_id", null: false
    t.datetime "receipted_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "rate", default: 0, null: false
    t.index ["offer_id"], name: "index_wants_on_offer_id"
    t.index ["user_id", "offer_id"], name: "index_wants_on_user_id_and_offer_id", unique: true
    t.index ["user_id"], name: "index_wants_on_user_id"
  end

  add_foreign_key "bean_images", "beans"
  add_foreign_key "bean_taste_tags", "beans"
  add_foreign_key "bean_taste_tags", "mst_taste_tags"
  add_foreign_key "beans", "mst_countries", column: "country_id"
  add_foreign_key "beans", "mst_roast_levels", column: "roast_level_id"
  add_foreign_key "beans", "roasters"
  add_foreign_key "likes", "offers"
  add_foreign_key "likes", "users"
  add_foreign_key "offers", "beans"
  add_foreign_key "roaster_relationships", "roasters"
  add_foreign_key "roaster_relationships", "users", column: "follower_id"
  add_foreign_key "users", "roasters"
  add_foreign_key "wants", "offers"
  add_foreign_key "wants", "users"
end
