class StreamsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_user, only: [:show, :start]

  def index
    @users = User.all
  end

  def show
  end

  

  private

  def set_user
    @user = User.find(params[:id])
  end
end
