class Api::V1::WantsController < Api::ApplicationController
  before_action :authenticate_api_v1_user!
  before_action :user_had_want_required_and_set_want, only: %i[show receipt rate]
  before_action :set_offer_and_required_before_the_receipted_ended_at, only: :create
  before_action :want_required_less_than_the_max_amount, only: :create
  before_action :want_required_not_received, only: :receipt
  before_action :required_want_is_not_rated, only: :rate

  def index
    status = params[:search]
    all_wants = current_api_v1_user.wants.includes(:offer)
    all_wants&.map { |want| want.offer.update_status } # NOTE: ステータス更新
    wants = if status.blank?
              all_wants.active.recent
            else
              all_wants.search_status(status).recent
            end
    @pagy, @wants = pagy(wants.includes(offer: [:roaster, :wanted_users, :wants, { bean: %i[roast_level country] }]))
    render formats: :json
  end

  def show
    @want.offer.update_status
    render formats: :json
  end

  def create
    user = current_api_v1_user
    user.want_offers << @offer
    @want = user.wants.last
    render 'show', formats: :json
  end

  def destroy
    @offer = Want.find(params[:id]).offer
    current_api_v1_user.want_offers.delete(@offer)
  end

  def receipt
    @want.receipted_at = Time.current
    @want.save
    render 'show', formats: :json
  end

  def rate
    @want.update(want_params)
    render 'show', formats: :json
  end

  # サインインユーザーのウォントのステータスを集計
  def stats
    wants = current_api_v1_user.wants.includes(:offer)
    on_offering_count = wants.count { |want| want.offer.on_offering? == true }
    on_roasting_count = wants.count { |want| want.offer.on_roasting? == true }
    on_preparing_count = wants.count { |want| want.offer.on_preparing? == true }
    on_selling_count = wants.count { |want| want.offer.on_selling? == true }
    end_of_sales_count = wants.count { |want| want.offer.end_of_sales? == true }
    not_recipted_count = wants.count { |want| want.receipted_at? == false && want.offer.on_selling? }
    render json: { on_offering: on_offering_count, on_roasting: on_roasting_count, on_preparing: on_preparing_count, on_selling: on_selling_count,
                   end_of_sales: end_of_sales_count, not_receipted: not_recipted_count }
  end

  private

  def want_params
    params.require(:want).permit(:offer_id, :rate)
  end

  def user_had_want_required_and_set_want
    @want = current_api_v1_user.wants.find_by(id: params[:id])
    return if @want

    render json: { messages: ['ウォンツが見つかりません'] }, status: :not_found
  end

  def set_offer_and_required_before_the_receipted_ended_at
    @offer = Offer.find(want_params[:offer_id])
    return unless @offer.ended_at.before? Date.current

    render json: { messages: ['オファーは終了しました'] }, status: :method_not_allowed
  end

  def want_required_less_than_the_max_amount
    return unless @offer.wants.count >= @offer.amount

    render json: { messages: ['数量が上限に達しています'] }, status: :method_not_allowed
  end

  def want_required_not_received
    return unless @want.receipted_at?

    render json: { messages: ['すでに受け取りが完了しています'] }, status: :method_not_allowed
  end

  def required_want_is_not_rated
    return if @want.unrated?

    render json: { messages: ['すでに評価が完了しています'] }, status: :method_not_allowed
  end
end
