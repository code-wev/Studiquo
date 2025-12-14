"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
exports.jwtConfig = {
    secret: process.env.JWT_SECRET || 'your-default-jwt-secret',
    signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d'),
    },
};
//# sourceMappingURL=jwt.config.js.map