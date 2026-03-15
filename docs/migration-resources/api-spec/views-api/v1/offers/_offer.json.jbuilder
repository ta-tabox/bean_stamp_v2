# Offerオブジェクトの属性から取得
json.extract! offer, :id, :bean_id, :price, :weight, :amount, :ended_at, :roasted_at, :receipt_started_at, :receipt_ended_at, :status, :created_at
json.created_at offer.created_at.to_date
json.roaster do
  json.id offer.roaster.id
  json.name offer.roaster.name
  json.thumbnail_url offer.roaster.image.thumb.url
end
json.bean do
  json.partial! 'api/v1/beans/bean', bean: offer.bean
end
json.want do
  if (want = current_api_v1_user.wants.find_by(offer_id: offer.id))
    json.is_wanted true
    json.id want.id
  else
    json.is_wanted false
  end
  json.count offer.wanted_users.length
end
json.like do
  if (like = current_api_v1_user.likes.find_by(offer_id: offer.id))
    json.is_liked true
    json.id like.id
  else
    json.is_liked false
  end
end
