class AddStreamFieldsToUesrs < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :username, :string
    add_index :users, :username, unique: true
    add_column :users, :channel_arn, :string
    add_column :users, :playback_url, :string
  end
end
