class Api::V1::RoasterRelationshipsController < Api::ApplicationController
  before_action :authenticate_api_v1_user!
  before_action :set_user
  before_action :set_roaster_from_all, only: %i[index create]
  before_action :set_roaster_from_following_roasters, only: :destroy

  def index
    if current_api_v1_user.following_roasters.include?(@roaster)
      @roaster_relationship = current_api_v1_user.roaster_relationships.find_by(roaster_id: @roaster.id)
    end
    render formats: :json
  end

  def create
    @user.following_roasters << @roaster
    @roaster_relationship = @user.roaster_relationships.last
    render formats: :json
  end

  def destroy
    @user.following_roasters.delete(@roaster)
    render formats: :json
  end

  private

  def set_user
    @user = current_api_v1_user
  end

  def set_roaster_from_all
    @roaster = Roaster.find_by(id: params[:roaster_id])
    return if @roaster

    render json: { messages: ['ロースターが存在しません'] }, status: :not_found
  end

  def set_roaster_from_following_roasters
    @roaster = RoasterRelationship.find_by(id: params[:id])&.roaster
    return if @roaster

    render json: { messages: ['フォローが存在しません'] }, status: :not_found
  end
end
