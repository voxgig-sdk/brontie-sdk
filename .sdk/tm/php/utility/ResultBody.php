<?php
declare(strict_types=1);

// Brontie SDK utility: result_body

class BrontieResultBody
{
    public static function call(BrontieContext $ctx): ?BrontieResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result && $response && $response->json_func && $response->body) {
            $result->body = ($response->json_func)();
        }
        return $result;
    }
}
