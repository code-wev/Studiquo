"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const availability_service_1 = require("./availability.service");
const availability_dto_1 = require("./dto/availability.dto");
let AvailabilityController = class AvailabilityController {
    availabilityService;
    constructor(availabilityService) {
        this.availabilityService = availabilityService;
    }
    async addAvailability(req, dto) {
        return this.availabilityService.addAvailability(req, dto);
    }
    async addTimeSlotForTutor(req, dto) {
        return this.availabilityService.addTimeSlotForTutor(req, dto);
    }
    async addTimeSlot(availabilityId, dto) {
        return this.availabilityService.addTimeSlot(availabilityId, dto);
    }
    async updateSlot(req, slotId, dto) {
        return this.availabilityService.updateSlot(req, slotId, dto);
    }
    async deleteSlot(req, slotId) {
        return this.availabilityService.deleteSlot(req, slotId);
    }
};
exports.AvailabilityController = AvailabilityController;
__decorate([
    (0, common_1.Post)('date'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.Tutor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, availability_dto_1.CreateAvailabilityDto]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "addAvailability", null);
__decorate([
    (0, common_1.Post)('slot'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.Tutor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, availability_dto_1.CreateTimeSlotDto]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "addTimeSlotForTutor", null);
__decorate([
    (0, common_1.Post)(':availabilityId/slots'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.Tutor),
    __param(0, (0, common_1.Param)('availabilityId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, availability_dto_1.CreateTimeSlotDto]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "addTimeSlot", null);
__decorate([
    (0, common_1.Put)(':slotId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.Tutor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('slotId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, availability_dto_1.UpdateTimeSlotDto]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "updateSlot", null);
__decorate([
    (0, common_1.Delete)(':slotId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.Tutor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('slotId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "deleteSlot", null);
exports.AvailabilityController = AvailabilityController = __decorate([
    (0, common_1.Controller)('availability'),
    __metadata("design:paramtypes", [availability_service_1.AvailabilityService])
], AvailabilityController);
//# sourceMappingURL=availability.controller.js.map