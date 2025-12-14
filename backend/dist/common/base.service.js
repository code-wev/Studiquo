"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    model;
    constructor(model) {
        this.model = model;
    }
    async findById(id) {
        return this.model.findById(id);
    }
    async findAll() {
        return this.model.find();
    }
    async updateById(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }
    async create(data) {
        const doc = new this.model(data);
        await doc.save();
        return doc;
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map