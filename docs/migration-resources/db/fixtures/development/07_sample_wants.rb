guest_user = User.find_by(guest: true)
users = User.where.not(guest: true).take(5)
offers = Offer.all
id = 1

users.count.times do |m|
  offers.count.times do |i|
    Want.seed_once do |s|
      s.id = id
      s.user_id = users[m].id
      s.offer_id = offers[i].id
    end
    id += 1
  end
  id += 1
end

# Offerの日程に応じた状態確認用テストウォンツ
beans = Bean.order(:created_at).where.not(roaster_id: guest_user.roaster.id).take(5)
beans.each do |bean|
  bean.offers.count.times do |offer_num|
    Want.seed_once do |s|
      s.id = id
      s.user_id = guest_user.id
      s.offer_id = bean.offers[offer_num].id
    end
    id += 1
  end
end
