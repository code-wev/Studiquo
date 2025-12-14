"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.Role = void 0;
const common_1 = require("@nestjs/common");
var Role;
(function (Role) {
    Role["Tutor"] = "Tutor";
    Role["Student"] = "Student";
    Role["Parent"] = "Parent";
    Role["Admin"] = "Admin";
})(Role || (exports.Role = Role = {}));
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;
//# sourceMappingURL=roles.decorator.js.map