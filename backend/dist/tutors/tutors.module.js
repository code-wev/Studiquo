"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorsModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const availability_module_1 = require("../availability/availability.module");
const jwt_config_1 = require("../common/jwt.config");
const review_model_1 = require("../models/review.model");
const tutorProfile_model_1 = require("../models/tutorProfile.model");
const user_model_1 = require("../models/user.model");
const tutors_controller_1 = require("./tutors.controller");
const tutors_service_1 = require("./tutors.service");
let TutorsModule = class TutorsModule {
};
exports.TutorsModule = TutorsModule;
exports.TutorsModule = TutorsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: tutorProfile_model_1.TutorProfile.name, schema: tutorProfile_model_1.TutorProfileSchema },
                { name: user_model_1.User.name, schema: user_model_1.UserSchema },
                { name: review_model_1.Review.name, schema: review_model_1.ReviewSchema },
            ]),
            availability_module_1.AvailabilityModule,
            jwt_1.JwtModule.register(jwt_config_1.jwtConfig),
        ],
        controllers: [tutors_controller_1.TutorsController],
        providers: [tutors_service_1.TutorsService],
        exports: [tutors_service_1.TutorsService],
    })
], TutorsModule);
//# sourceMappingURL=tutors.module.js.map