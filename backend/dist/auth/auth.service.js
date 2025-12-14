"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const mongoose_2 = require("mongoose");
const mail_service_1 = require("../mail/mail.service");
const user_model_1 = require("../models/user.model");
let AuthService = class AuthService {
    userModel;
    jwtService;
    mailService;
    constructor(userModel, jwtService, mailService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async register(data) {
        const alreadyExists = await this.userModel.findOne({ email: data.email });
        if (alreadyExists) {
            throw new common_1.UnauthorizedException('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = new this.userModel({ ...data, password: hashedPassword });
        await user.save();
        await this.mailService.sendWelcomeEmail(user.email, `${user.firstName} ${user.lastName}`);
        return { message: 'Registration successful' };
    }
    async login(data) {
        const user = await this.userModel.findOne({ email: data.email });
        if (!user || !(await bcrypt.compare(data.password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = this.jwtService.sign({ sub: user._id, role: user.role });
        return {
            message: 'Login successful',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
            token,
        };
    }
    async forgotPassword(data) {
        const user = await this.userModel.findOne({ email: data });
        if (!user)
            return { message: 'If the email exists, a reset link will be sent' };
        const resetToken = this.jwtService.sign({ sub: user._id }, { expiresIn: '5m' });
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?email=${encodeURIComponent(data)}&token=${resetToken}`;
        await this.mailService.sendResetPasswordEmail(data, resetLink);
        return {
            message: 'Reset link sent to your email if it exists',
        };
    }
    async resetPassword(data) {
        const user = await this.userModel.findOne({
            email: data.email,
            token: data.token,
        });
        if (!user)
            throw new common_1.UnauthorizedException('User not found or session expired');
        user.password = await bcrypt.hash(data.newPassword, 10);
        user.token = '';
        await user.save();
        return { message: 'Password reset successful' };
    }
    async changePassword(data) {
        const user = await this.userModel.findById(data.userId);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        if (!(await bcrypt.compare(data.oldPassword, user.password))) {
            throw new common_1.UnauthorizedException('Old password is incorrect');
        }
        user.password = await bcrypt.hash(data.newPassword, 10);
        await user.save();
        return { message: 'Password changed successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map