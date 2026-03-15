id = 2
# set_recommend_offersメソッドの確認用に東京都のロースターを準備する
5.times do
  Roaster.seed_once do |s|
    s.id = id
    s.name = "#{Faker::Restaurant.name_prefix}ロースター"
    s.phone_number = Faker::Number.leading_zero_number(digits: 10)
    s.prefecture_code = '13'
    s.address = Faker::Address.city
    s.describe = Faker::Lorem.sentence(word_count: 5)
    s.image = File.open(Rails.root.join('db/fixtures/images/roasters/roaster_1.jpg'))
  end
  id += 1
end
15.times do
  Roaster.seed_once do |s|
    s.id = id
    s.name = "#{Faker::Restaurant.name_prefix}ロースター"
    s.phone_number = Faker::Number.leading_zero_number(digits: 10)
    s.prefecture_code = Faker::Number.within(range: 1..47)
    s.address = Faker::Address.city
    s.describe = Faker::Lorem.sentence(word_count: 5)
    s.image = File.open(Rails.root.join('db/fixtures/images/roasters/roaster_1.jpg'))
  end
  id += 1
end
