guest_user = User.find_by(guest: true)
users = User.where.not(guest: true)
guest_roaster = Roaster.find_by(guest: true)
roasters = Roaster.where.not(guest: true)
id = 1

roasters.count.times do |roaster_num|
  RoasterRelationship.seed_once do |s|
    s.id = id
    s.follower_id = guest_user.id
    s.roaster_id = roasters[roaster_num].id
  end
  id += 1
end

users.count.times do |user_num|
  RoasterRelationship.seed_once do |s|
    s.id = id
    s.follower_id = users[user_num].id
    s.roaster_id = guest_roaster.id
  end
  id += 1
end
