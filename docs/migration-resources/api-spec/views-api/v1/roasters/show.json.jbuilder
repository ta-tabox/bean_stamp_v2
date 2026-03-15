json.partial! 'api/v1/roasters/roaster', roaster: @roaster
json.followers_count @roaster.followers.length
json.roaster_relationship_id @roaster_relationship_id || nil
