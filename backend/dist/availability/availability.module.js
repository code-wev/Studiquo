"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_config_1 = require("../common/jwt.config");
const timeSlot_model_1 = require("../models/timeSlot.model");
const tutorAvailability_model_1 = require("../models/tutorAvailability.model");
const availability_controller_1 = require("./availability.controller");
const availability_service_1 = require("./availability.service");
let AvailabilityModule = class AvailabilityModule {
};
exports.AvailabilityModule = AvailabilityModule;
exports.AvailabilityModule = AvailabilityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: tutorAvailability_model_1.TutorAvailability.name, schema: tutorAvailability_model_1.TutorAvailabilitySchema },
                { name: timeSlot_model_1.TimeSlot.name, schema: timeSlot_model_1.TimeSlotSchema },
            ]),
            jwt_1.JwtModule.register(jwt_config_1.jwtConfig),
        ],
        controllers: [availability_controller_1.AvailabilityController],
        providers: [availability_service_1.AvailabilityService],
        exports: [availability_service_1.AvailabilityService],
    })
], AvailabilityModule);
//# sourceMappingURL=availability.module.js.map