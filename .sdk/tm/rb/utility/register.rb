# Brontie SDK utility registration
require_relative '../core/utility_type'
require_relative 'clean'
require_relative 'done'
require_relative 'make_error'
require_relative 'feature_add'
require_relative 'feature_hook'
require_relative 'feature_init'
require_relative 'fetcher'
require_relative 'make_fetch_def'
require_relative 'make_context'
require_relative 'make_options'
require_relative 'make_request'
require_relative 'make_response'
require_relative 'make_result'
require_relative 'make_point'
require_relative 'make_spec'
require_relative 'make_url'
require_relative 'param'
require_relative 'prepare_auth'
require_relative 'prepare_body'
require_relative 'prepare_headers'
require_relative 'prepare_method'
require_relative 'prepare_params'
require_relative 'prepare_path'
require_relative 'prepare_query'
require_relative 'graphql'
require_relative 'result_basic'
require_relative 'result_body'
require_relative 'result_headers'
require_relative 'transform_request'
require_relative 'transform_response'

BrontieUtility.registrar = ->(u) {
  u.clean = BrontieUtilities::Clean
  u.done = BrontieUtilities::Done
  u.make_error = BrontieUtilities::MakeError
  u.feature_add = BrontieUtilities::FeatureAdd
  u.feature_hook = BrontieUtilities::FeatureHook
  u.feature_init = BrontieUtilities::FeatureInit
  u.fetcher = BrontieUtilities::Fetcher
  u.make_fetch_def = BrontieUtilities::MakeFetchDef
  u.make_context = BrontieUtilities::MakeContext
  u.make_options = BrontieUtilities::MakeOptions
  u.make_request = BrontieUtilities::MakeRequest
  u.make_response = BrontieUtilities::MakeResponse
  u.make_result = BrontieUtilities::MakeResult
  u.make_point = BrontieUtilities::MakePoint
  u.make_spec = BrontieUtilities::MakeSpec
  u.make_url = BrontieUtilities::MakeUrl
  u.param = BrontieUtilities::Param
  u.prepare_auth = BrontieUtilities::PrepareAuth
  u.prepare_body = BrontieUtilities::PrepareBody
  u.prepare_headers = BrontieUtilities::PrepareHeaders
  u.prepare_method = BrontieUtilities::PrepareMethod
  u.prepare_params = BrontieUtilities::PrepareParams
  u.prepare_path = BrontieUtilities::PreparePath
  u.prepare_query = BrontieUtilities::PrepareQuery
  u.graphql_body = BrontieUtilities::GraphqlBody
  u.graphql_errors = BrontieUtilities::GraphqlErrors
  u.result_basic = BrontieUtilities::ResultBasic
  u.result_body = BrontieUtilities::ResultBody
  u.result_headers = BrontieUtilities::ResultHeaders
  u.transform_request = BrontieUtilities::TransformRequest
  u.transform_response = BrontieUtilities::TransformResponse
}
