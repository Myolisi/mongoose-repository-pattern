import { CRUD } from '../../src/mongoose-crud';

//if you dont want to create a typegoose schema use null
export default class UserModel extends CRUD<null> {
  constructor() {
    super('mongo-crud', 'testingdb');
  }
  getStuff() {
    return this.find().exec();
  }
}
