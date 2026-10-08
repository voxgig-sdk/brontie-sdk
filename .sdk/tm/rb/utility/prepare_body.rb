# Brontie SDK utility: prepare_body
require_relative 'media'
module BrontieUtilities
  PrepareBody = ->(ctx) {
    return nil unless ctx.op.input == "data"
    return BrontieUtilities.raw_body(ctx.reqdata) if BrontieUtilities.raw_request?(ctx.point)
    ctx.utility.transform_request.call(ctx)
  }
end
