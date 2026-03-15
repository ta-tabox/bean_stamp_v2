class Api::V1::LikesController < Api::ApplicationController
  before_action :authenticate_api_v1_user!

  def index
    status = params[:search]
    all_likes = current_api_v1_user.likes.includes(:offer)
    all_likes&.map { |want| want.offer.update_status } # NOTE: ステータス更新
    likes = if status.blank?
              all_likes.recent
            else
              all_likes.search_status(status).recent
            end
    @pagy, @likes = pagy(likes.includes(offer: [:roaster, :wanted_users, :wants, { bean: %i[roast_level country] }]))
    render formats: :json
  end

  def create
    user = current_api_v1_user
    offer = Offer.find(like_params[:offer_id])
    user.like_offers << offer
    @like = user.likes.last
    render 'show', formats: :json
  end

  def destroy
    @offer = Like.find(params[:id]).offer
    current_api_v1_user.like_offers.delete(@offer)
  end

  private

  def like_params
    params.require(:like).permit(:offer_id)
  end
end
