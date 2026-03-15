class Api::V1::OffersController < Api::ApplicationController
  before_action :authenticate_api_v1_user!
  before_action :user_belonged_to_roaster_required, except: %i[show recommend]
  before_action :roaster_had_bean_requierd, only: %i[create]
  before_action :roaster_had_offer_requierd_and_set_offer, only: %i[update destroy wanted_users]

  def index
    status = params[:search]
    all_offers = current_api_v1_roaster.offers
    all_offers&.map(&:update_status)
    offers = if status.blank?
               all_offers.active.recent
             else
               all_offers.search_status(status)
             end
    @pagy, @offers = pagy(offers.includes(:roaster, :wanted_users, { bean: %i[roast_level bean_images] }))
    render formats: :json
  end

  def show
    @offer = Offer.find_by(id: params[:id])
    @offer.update_status
    render formats: :json
  end

  def create
    @offer = Offer.new(offer_params)
    if @offer.save
      render 'show', formats: :json
    else
      render json: { messages: @offer.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @offer.update(offer_params)
      render 'show', formats: :json
    else
      render json: { messages: @offer.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @offer.wants.any?
      render json: { messages: ['オファーはウォンツされています'] }, status: :unprocessable_entity
      return
    end

    if @offer.destroy
      render json: { messages: ['オファーを削除しました'] }, status: :ok
    else
      render json: { messages: ['オファーの削除に失敗しました'] }, status: :method_not_allowed
    end
  end

  def wanted_users
    @pagy, @users = pagy(@offer.wanted_users)
    render 'api/v1/users/index', formats: :json
  end

  def recommend
    # おすすめのオファーを10件返す
    # ユーザーが好むテイストタグを持つオファーを選定
    offers = Offer.on_offering.recommended_for(current_api_v1_user)
    # 無ければユーザーの登録地域と近いオファーを選定
    unless offers.any?
      offers = Offer.on_offering.near_for(current_api_v1_user)
    end
    @offers = offers.includes(:roaster, :wanted_users, { bean: %i[roast_level bean_images country taste_tags] }).sample(10)

    render 'index', formats: :json
  end

  # 現在のロースターのオファーのステータスを集計
  def stats
    offers = current_api_v1_roaster.offers
    on_offering_count = offers.count(&:on_offering?)
    on_roasting_count = offers.count(&:on_roasting?)
    on_preparing_count = offers.count(&:on_preparing?)
    on_selling_count = offers.count(&:on_selling?)
    end_of_sales_count = offers.count(&:end_of_sales?)
    render json: { on_offering: on_offering_count, on_roasting: on_roasting_count, on_preparing: on_preparing_count, on_selling: on_selling_count,
                   end_of_sales: end_of_sales_count }
  end

  private

  def offer_params
    params.require(:offer).permit(:bean_id, :ended_at, :roasted_at, :receipt_started_at, :receipt_ended_at, :price, :weight, :amount)
  end

  def roaster_had_bean_requierd
    return if current_api_v1_roaster.beans.find_by(id: offer_params[:bean_id])

    render json: { messages: ['コーヒー豆を登録してください'] }, status: :not_found
  end

  def set_offer
    @offer = Offer.find_by(id: params[:id])
  end

  def roaster_had_offer_requierd_and_set_offer
    @offer = current_api_v1_roaster.offers.find_by(id: params[:id])
    return if @offer

    render json: { messages: ['オファーを登録してください'] }, status: :not_found
  end
end
