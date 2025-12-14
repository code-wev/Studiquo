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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorProfileSchema = exports.TutorProfile = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let TutorProfile = class TutorProfile extends mongoose_2.Document {
    user;
    subjects;
    hourlyRate;
};
exports.TutorProfile = TutorProfile;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], TutorProfile.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
        enum: ['MATH', 'SCIENCE', 'ENGLISH'],
        required: true,
    }),
    __metadata("design:type", Array)
], TutorProfile.prototype, "subjects", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], TutorProfile.prototype, "hourlyRate", void 0);
exports.TutorProfile = TutorProfile = __decorate([
    (0, mongoose_1.Schema)()
], TutorProfile);
exports.TutorProfileSchema = mongoose_1.SchemaFactory.createForClass(TutorProfile);
//# sourceMappingURL=tutorProfile.model.js.map