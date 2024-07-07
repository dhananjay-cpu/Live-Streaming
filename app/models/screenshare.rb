class Screenshare < ApplicationRecord
    def self.generate_streamkey
        SecureRandom.hex(16)
    end
end
