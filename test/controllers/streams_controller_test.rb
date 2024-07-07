require "test_helper"

class StreamsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get streams_index_url
    assert_response :success
  end

  test "should get show" do
    get streams_show_url
    assert_response :success
  end
end
