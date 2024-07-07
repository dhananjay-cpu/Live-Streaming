class ScreensharesController < ApplicationController
    protect_from_forgery except: :start
    def start
        streamkey = Screenshare.generate_streamkey
        @screenshare = Screenshare.find_or_create_by(streamkey: streamkey)

        respond_to do |format|
            format.json{ render json:{ streamkey: @screenshare.streamkey }, status: :ok}
        end

    rescue StandardError => e
        respond_to do |format|
            format.json{ render json: { error: e.message} }
        end
    end
end
