-- Brontie SDK error

local BrontieError = {}
BrontieError.__index = BrontieError


function BrontieError.new(code, msg, ctx)
  local self = setmetatable({}, BrontieError)
  self.is_sdk_error = true
  self.sdk = "Brontie"
  self.code = code or ""
  self.msg = msg or ""
  self.ctx = ctx
  self.result = nil
  self.spec = nil
  return self
end


function BrontieError:error()
  return self.msg
end


function BrontieError:__tostring()
  return self.msg
end


return BrontieError
