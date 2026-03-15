# ログイン状態確認用のコントローラ
class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController
  wrap_parameters format: [] # parameterのフォーマットをキャンセル

  def index
    @current_user = current_api_v1_user
    @current_roaster = current_api_v1_user.roaster if current_api_v1_user
    render formats: :json
  end
end
