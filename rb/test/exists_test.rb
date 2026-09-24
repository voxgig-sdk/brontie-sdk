# Brontie SDK exists test

require "minitest/autorun"
require_relative "../Brontie_sdk"

class ExistsTest < Minitest::Test
  def test_create_test_sdk
    testsdk = BrontieSDK.test(nil, nil)
    assert !testsdk.nil?
  end
end
