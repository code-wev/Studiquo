import { Model } from 'mongoose';

export class BaseService<T> {
  constructor(protected model: Model<T>) {}

  async findById(id: string) {
    return this.model.findById(id);
  }

  async findAll() {
    return this.model.find();
  }

  async updateById(id: string, data: any) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async create(data: any) {
    const doc = new this.model(data);
    await doc.save();
    return doc;
  }
}
