# Brontie SDK feature factory

from brontie_sdk.feature.base_feature import BrontieBaseFeature
from brontie_sdk.feature.debug_feature import BrontieDebugFeature
from brontie_sdk.feature.idempotency_feature import BrontieIdempotencyFeature
from brontie_sdk.feature.metrics_feature import BrontieMetricsFeature
from brontie_sdk.feature.paging_feature import BrontiePagingFeature
from brontie_sdk.feature.ratelimit_feature import BrontieRatelimitFeature
from brontie_sdk.feature.retry_feature import BrontieRetryFeature
from brontie_sdk.feature.test_feature import BrontieTestFeature
from brontie_sdk.feature.timeout_feature import BrontieTimeoutFeature


_FEATURES = {
    "base": lambda: BrontieBaseFeature(),
    "debug": lambda: BrontieDebugFeature(),
    "idempotency": lambda: BrontieIdempotencyFeature(),
    "metrics": lambda: BrontieMetricsFeature(),
    "paging": lambda: BrontiePagingFeature(),
    "ratelimit": lambda: BrontieRatelimitFeature(),
    "retry": lambda: BrontieRetryFeature(),
    "test": lambda: BrontieTestFeature(),
    "timeout": lambda: BrontieTimeoutFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
