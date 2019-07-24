import { CRUD } from '../../src/mongoose-crud';

//if you dont want to create a typegoose schema use null
export default class UserModel extends CRUD<null> {
  constructor() {
    //here you pass the database and the collection
    super('mongo-crud', 'testingdb');
  }
  //write your query
  getStuff() {
    return this.find().exec();
  }

  updateUser(condition, data, callback) {
    return this.updateOne(
      condition,
      data,
      {
        strict: false //we want to ignore validation with the schema
      },
      callback
    );
  }
}
