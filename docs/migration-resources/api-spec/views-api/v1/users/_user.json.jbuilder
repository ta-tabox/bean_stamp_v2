# ユーザーデータ
json.extract! user, :id, :name, :email, :prefecture_code, :describe, :roaster_id, :guest
json.image_url user.image_url
json.thumbnail_url user.image.thumb.url
