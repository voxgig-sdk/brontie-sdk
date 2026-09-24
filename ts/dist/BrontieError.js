"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrontieError = void 0;
class BrontieError extends Error {
    isBrontieError = true;
    sdk = 'Brontie';
    code;
    ctx;
    status = -1;
    // `err.notFound` rather than a magic number at every call site.
    get notFound() { return 404 === this.status; }
    constructor(code, msg, ctx) {
        super(msg);
        this.code = code;
        this.ctx = ctx;
    }
}
exports.BrontieError = BrontieError;
//# sourceMappingURL=BrontieError.js.map