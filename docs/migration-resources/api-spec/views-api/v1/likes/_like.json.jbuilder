json.extract! like, :id, :user_id, :offer_id
json.offer do
  json.partial! 'api/v1/offers/offer', offer: like.offer
end
