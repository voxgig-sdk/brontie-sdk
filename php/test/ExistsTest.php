<?php
declare(strict_types=1);

// Brontie SDK exists test

require_once __DIR__ . '/../brontie_sdk.php';

use PHPUnit\Framework\TestCase;

class ExistsTest extends TestCase
{
    public function test_create_test_sdk(): void
    {
        $testsdk = BrontieSDK::test(null, null);
        $this->assertNotNull($testsdk);
    }
}
