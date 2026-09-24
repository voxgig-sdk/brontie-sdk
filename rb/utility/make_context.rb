# Brontie SDK utility: make_context
require_relative '../core/context'
module BrontieUtilities
  MakeContext = ->(ctxmap, basectx) {
    BrontieContext.new(ctxmap, basectx)
  }
end
