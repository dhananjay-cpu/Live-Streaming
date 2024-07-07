require 'aws-sdk-ivs'

module Stream
    class IvsClient
        def initialize
            @client = Aws::IVS::Client.new(region: 'us-east-1',
                                            access_key_id: Rails.application.credentials.aws[:access_key_id],
                                            secret_access_key: Rails.application.credentials.aws[:secret_access_key])

            def create_channel(resource)
                raise ArgumentError, "Resource must be a User object" unless resource.is_a?(User)

                responce = @client.create_channel(name: resource.username)
                resource&.stream_key&.destroy

                stream_key = StreamKey.create(
                    arn: responce.stream_key.arn,
                    channel_arn: responce.channel.arn,
                    value: responce.stream_key.value,
                    user: resource
                )

                resource.update(
                    channel_arn: responce.channel.arn,
                    playback_url: responce.channel.playback_url,
                    stream_key: 
                )

                def update_channel_name(resource)
                    raise ArgumentError, "Resource must be a User object" unless resource.is_a?(User)

                    @client.update_channel(name: resource.name, arn: resource.channel_arn)
                end
            end
        end
    end
end