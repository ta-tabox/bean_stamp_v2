json.extract! want, :id, :user_id, :offer_id, :rate, :receipted_at
json.offer do
  json.partial! 'api/v1/offers/offer', offer: want.offer
end
