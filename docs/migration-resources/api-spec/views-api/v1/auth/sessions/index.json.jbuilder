if @current_user
  json.is_login true
  json.user @current_user, partial: 'api/v1/users/user', as: :user
  if @current_roaster
    json.roaster @current_roaster, partial: 'api/v1/roasters/roaster', as: :roaster
  else
    json.roaster nil
  end
else
  json.is_login false
  json.message 'ユーザーが存在しません'
end
