class Api::V1::SearchController < Api::ApplicationController
  before_action :authenticate_api_v1_user!

  def roasters
    # ransackのクエリの形に整える
    query_params = { 'name_cont' => roasters_query_params[:name], 'prefecture_code_eq' => roasters_query_params[:prefecture_code] }
    query = Roaster.ransack(query_params) # ransackによる検索
    @pagy, @roasters = pagy(query.result(distinct: true))
    render 'api/v1/roasters/index', formats: :json
  end

  def offers
    # ransackのクエリの形に整える
    query_params = { 'bean_roaster_prefecture_code_eq' => offers_query_params[:prefecture_code], 'bean_country_id_eq' => offers_query_params[:country_id],
                     'bean_roast_level_id_eq' => offers_query_params[:roast_level_id], 'bean_taste_tags_id_eq' => offers_query_params[:taste_tag_id] }

    # オファー中のもののみ検索
    query = Offer.where('ended_at >= ?', Date.current).ransack(query_params) # ransackによる検索

    offers = query.result(distinct: true)
    offers&.map(&:update_status) # NOTE: status更新
    @pagy, @offers = pagy(offers.recent.includes(:roaster, :wanted_users, { bean: %i[roast_level bean_images taste_tags] }))

    render 'api/v1/offers/index', formats: :json
  end

  private

  def roasters_query_params
    params.permit(:name, :prefecture_code, :page)
  end

  def offers_query_params
    params.permit(:prefecture_code, :country_id, :roast_level_id, :taste_tag_id, :page)
  end
end
