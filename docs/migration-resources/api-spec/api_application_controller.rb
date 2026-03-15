class Api::ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken # tokenによる認証をONにする

  # Pagyによるpaginationモジュールを読み込む
  include Pagy::Backend
  # pagy情報をheadersに追加する
  after_action { pagy_headers_merge(@pagy) if @pagy }

  private

  # ユーザーにロースター所属を求める V1
  def user_belonged_to_roaster_required
    return if current_api_v1_user.roaster_id?

    render json: { messages: ['ロースターを登録をしてください'] }, status: :method_not_allowed
  end

  # ユーザーにロースター未所属を求める V1
  def user_not_belonged_to_roaster_required
    return unless current_api_v1_user.roaster_id?

    render json: { messages: ['ロースターをすでに登録しています'] }, status: :method_not_allowed
  end

  # ログイン中のユーザーが所属するロースターを返す V1
  def current_api_v1_roaster
    current_api_v1_user.roaster
  end
end
