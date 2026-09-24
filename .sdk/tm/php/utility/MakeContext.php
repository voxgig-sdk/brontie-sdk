<?php
declare(strict_types=1);

// Brontie SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class BrontieMakeContext
{
    public static function call(array $ctxmap, ?BrontieContext $basectx): BrontieContext
    {
        return new BrontieContext($ctxmap, $basectx);
    }
}
