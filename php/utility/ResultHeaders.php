<?php
declare(strict_types=1);

// Brontie SDK utility: result_headers

class BrontieResultHeaders
{
    public static function call(BrontieContext $ctx): ?BrontieResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
