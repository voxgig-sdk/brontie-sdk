<?php
declare(strict_types=1);

// Brontie SDK base feature

class BrontieBaseFeature
{
    public string $version;
    public string $name;
    public bool $active;

    // Positions this feature when added via the client `extend` option:
    // "__before__" / "__after__" / "__replace__" name an already-added
    // feature (mirrors the ts feature `_options`). Declared so setting it
    // on an extension instance avoids the dynamic-property deprecation.
    public ?array $_options = null;

    public function __construct()
    {
        $this->version = '0.0.1';
        $this->name = 'base';
        $this->active = true;
    }

    public function get_version(): string { return $this->version; }
    public function get_name(): string { return $this->name; }
    public function get_active(): bool { return $this->active; }

    public function init(BrontieContext $ctx, array $options): void {}
    public function PostConstruct(BrontieContext $ctx): void {}
    public function PostConstructEntity(BrontieContext $ctx): void {}
    public function SetData(BrontieContext $ctx): void {}
    public function GetData(BrontieContext $ctx): void {}
    public function GetMatch(BrontieContext $ctx): void {}
    public function SetMatch(BrontieContext $ctx): void {}
    public function PrePoint(BrontieContext $ctx): void {}
    public function PreSpec(BrontieContext $ctx): void {}
    public function PreRequest(BrontieContext $ctx): void {}
    public function PreResponse(BrontieContext $ctx): void {}
    public function PreResult(BrontieContext $ctx): void {}
    public function PreDone(BrontieContext $ctx): void {}
    public function PreUnexpected(BrontieContext $ctx): void {}
}
