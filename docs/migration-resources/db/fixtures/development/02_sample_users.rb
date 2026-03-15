20.times do |n|
  User.seed_once do |s|
    email = Faker::Internet.email
    s.id = n + 2
    s.name = Faker::Name.name
    s.email = email
    s.uid = email
    s.prefecture_code = Faker::Number.within(range: 1..47)
    s.password = 'password'
    s.password_confirmation = 'password'
    s.describe = Faker::Lorem.sentence(word_count: 5)
    s.image = File.open(Rails.root.join('db/fixtures/images/users/user_1.jpg'))
  end
end
