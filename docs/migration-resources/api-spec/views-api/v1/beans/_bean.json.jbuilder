# Beanオブジェクトの属性から取得
json.extract! bean, :id,
              :roaster_id,
              :name,
              :subregion,
              :farm,
              :variety,
              :elevation,
              :process,
              :describe,
              :acidity,
              :flavor,
              :body,
              :bitterness,
              :sweetness
json.cropped_at bean.cropped_at.strftime('%Y-%m') if bean.cropped_at

json.country do
  json.id bean.country.id
  json.name bean.country.name # ネストした属性 country_id から変換
end

json.roast_level do
  json.id bean.roast_level.id
  json.name bean.roast_level.name
end

json.taste do
  # 1対多の属性 配列を返す tag.id == 0は未選択状態なので除く
  json.ids bean.taste_tags.reject { |tag| tag.id.zero? }.map(&:id)
  json.names = bean.taste_tags.reject { |tag| tag.id.zero? }.map(&:name)
end

# WARNING 画像update時には以前の画像も残って返される. 変数beanがupdate時に再代入されないため、update前のデータをそのまま持っている？
json.image_urls = bean.bean_images.map { |bean_image| bean_image.image.url } # 1対多の属性 urlの配列を返す
json.thumbnail_url = bean.bean_images[0].image.thumb.url
