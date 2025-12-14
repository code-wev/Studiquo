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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const mongoose_2 = require("mongoose");
const studentProfile_model_1 = require("../models/studentProfile.model");
const tutorProfile_model_1 = require("../models/tutorProfile.model");
const base_service_1 = require("../common/base.service");
const helpers_1 = require("../common/helpers");
const user_model_1 = require("../models/user.model");
let UsersService = UsersService_1 = class UsersService extends base_service_1.BaseService {
    tutorProfileModel;
    studentProfileModel;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(userModel, tutorProfileModel, studentProfileModel) {
        super(userModel);
        this.tutorProfileModel = tutorProfileModel;
        this.studentProfileModel = studentProfileModel;
    }
    async getMe(req) {
        const userId = (0, helpers_1.getUserSub)(req);
        const user = await this.model.findById(userId).select('-password').lean();
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        let profile = null;
        if (user.role === 'Tutor') {
            profile = await this.tutorProfileModel.findOne({ user: userId }).lean();
        }
        if (user.role === 'Student') {
            profile = await this.studentProfileModel.findOne({ user: userId }).lean();
        }
        return { ...user, profile };
    }
    async updateMe(req, data) {
        const userId = (0, helpers_1.getUserSub)(req);
        const userDoc = await this.model.findById(userId);
        if (!userDoc)
            throw new common_1.UnauthorizedException('User not found');
        const userRole = userDoc.role;
        const { firstName, lastName, bio, avatar, dbsLink, subject, hourlyRate, yearGroup, confidenceLevel, currentGrade, targetGrade, } = data;
        const userUpdate = {};
        if (firstName !== undefined)
            userUpdate.firstName = firstName;
        if (lastName !== undefined)
            userUpdate.lastName = lastName;
        if (bio !== undefined)
            userUpdate.bio = bio;
        if (avatar !== undefined)
            userUpdate.avatar = avatar;
        if (dbsLink !== undefined)
            userUpdate.dbsLink = dbsLink;
        if (Object.keys(userUpdate).length > 0) {
            await this.model.findByIdAndUpdate(userId, { $set: userUpdate });
        }
        let profile = null;
        if (userRole === 'Tutor') {
            const tutorUpdate = {};
            if (subject !== undefined)
                tutorUpdate.subjects = [subject];
            if (hourlyRate !== undefined)
                tutorUpdate.hourlyRate = hourlyRate;
            profile = await this.tutorProfileModel.findOneAndUpdate({ user: userId }, { $set: tutorUpdate }, { new: true, upsert: true });
        }
        if (userRole === 'Student') {
            const studentUpdate = {};
            if (yearGroup !== undefined)
                studentUpdate.yearGroup = yearGroup;
            if (confidenceLevel !== undefined)
                studentUpdate.confidenceLevel = confidenceLevel;
            if (currentGrade !== undefined)
                studentUpdate.currentGrade = currentGrade;
            if (targetGrade !== undefined)
                studentUpdate.targetGrade = targetGrade;
            profile = await this.studentProfileModel.findOneAndUpdate({ user: userId }, { $set: studentUpdate }, { new: true, upsert: true });
        }
        const updatedUser = await this.model
            .findById(userId)
            .select('-password')
            .lean();
        return {
            ...updatedUser,
            profile,
        };
    }
    async updatePassword(req, data) {
        const userDoc = await this.model.findById((0, helpers_1.getUserSub)(req));
        if (!userDoc)
            throw new common_1.UnauthorizedException('User not found');
        userDoc.password = await bcrypt.hash(data.newPassword, 10);
        await userDoc.save();
        return { message: 'Password updated' };
    }
    async ensureAdminExists() {
        const admin = await this.model.findOne({ role: 'Admin' }).exec();
        if (admin) {
            this.logger.log(`Admin user exists: ${admin.email}`);
            return admin;
        }
        const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
        const password = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123';
        const firstName = process.env.DEFAULT_ADMIN_FIRSTNAME || 'Admin';
        const lastName = process.env.DEFAULT_ADMIN_LASTNAME || 'User';
        const avatar = process.env.DEFAULT_ADMIN_AVATAR || 'default-avatar.png';
        const hashed = await bcrypt.hash(password, 10);
        const adminDoc = new this.model({
            email,
            password: hashed,
            firstName,
            lastName,
            role: 'Admin',
            avatar,
        });
        await adminDoc.save();
        this.logger.log(`Default admin created: ${email}`);
        return adminDoc;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(tutorProfile_model_1.TutorProfile.name)),
    __param(2, (0, mongoose_1.InjectModel)(studentProfile_model_1.StudentProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map