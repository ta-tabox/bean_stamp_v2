json.roaster_relationship do
  json.id nil
  json.user do
    json.id @user.id
    json.name @user.name
    json.following_roasters_count @user.following_roasters.length
  end
  json.roaster do
    json.id @roaster.id
    json.name @roaster.name
    json.followers_count @roaster.followers.length
  end
end
