# Brontie SDK exists test

import pytest
from brontie_sdk import BrontieSDK


class TestExists:

    def test_should_create_test_sdk(self):
        testsdk = BrontieSDK.test(None, None)
        assert testsdk is not None
