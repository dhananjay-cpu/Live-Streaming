class CreateScreenshares < ActiveRecord::Migration[7.1]
  def change
    create_table :screenshares do |t|
      t.string :streamkey

      t.timestamps
    end
    add_index :screenshares, :streamkey, unique: true
  end
end
