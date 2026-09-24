# Brontie SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/debug_feature'
require_relative 'feature/idempotency_feature'
require_relative 'feature/metrics_feature'
require_relative 'feature/paging_feature'
require_relative 'feature/ratelimit_feature'
require_relative 'feature/retry_feature'
require_relative 'feature/test_feature'
require_relative 'feature/timeout_feature'


module BrontieFeatures
  def self.make_feature(name)
    case name
    when "base"
      BrontieBaseFeature.new
    when "debug"
      BrontieDebugFeature.new
    when "idempotency"
      BrontieIdempotencyFeature.new
    when "metrics"
      BrontieMetricsFeature.new
    when "paging"
      BrontiePagingFeature.new
    when "ratelimit"
      BrontieRatelimitFeature.new
    when "retry"
      BrontieRetryFeature.new
    when "test"
      BrontieTestFeature.new
    when "timeout"
      BrontieTimeoutFeature.new
    else
      BrontieBaseFeature.new
    end
  end
end
