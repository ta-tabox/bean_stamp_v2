if @roaster_relationship
  json.is_followed_by_signed_in_user true
  json.roaster_relationship_id @roaster_relationship.id
else
  json.is_followed_by_signed_in_user false
  json.roaster_relationship_id nil
end
