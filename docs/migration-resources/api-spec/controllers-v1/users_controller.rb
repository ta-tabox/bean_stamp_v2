class Api::V1::UsersController < Api::ApplicationController
  before_action :authenticate_api_v1_user!
  before_action :set_user, only: %i[show roasters_followed_by_user]

  def show
    render formats: :json
  end

  def roasters_followed_by_user
    @pagy, @roasters = pagy(@user.following_roasters)
    render 'api/v1/roasters/index', formats: :json
  end

  def current_offers
    # enum型のon_offeringでオファー中のオファーを引っ張るとオファーが終了しているのに、
    # statusが更新されていないものを取ることがある→where文でended_atを直接参照するようにした
    offers = Offer.where('ended_at >= ?', Date.current).following_by(current_api_v1_user).recent
    offers&.map(&:update_status)
    @pagy, @offers = pagy(offers.includes(:roaster, :wanted_users, :wants, bean: %i[bean_images roast_level]))
    render 'api/v1/offers/index', formats: :json
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
