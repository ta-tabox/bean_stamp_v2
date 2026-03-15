beans = Bean.all
beans.count.times do |n|
  3.times do |i|
    BeanTasteTag.seed_once do |s|
      s.id = (n * 3) + i + 1
      s.bean_id = n + 1
      s.mst_taste_tag_id = Faker::Number.unique.within(range: 1..70)
    end
  end
  Faker::Number.unique.clear
end
