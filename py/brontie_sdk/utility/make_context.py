# Brontie SDK utility: make_context

from brontie_sdk.core.context import BrontieContext


def make_context_util(ctxmap, basectx):
    return BrontieContext(ctxmap, basectx)
