import { CRUD } from '../../src/mongoose-crud';
import { Typegoose, prop } from 'typegoose';

//here we create our schema
class testingdb extends Typegoose {
  @prop()
  name: string;

  @prop({ required: true, minlength: 5 })
  surname: string;
}

export default class UserModel extends CRUD<testingdb> {
  constructor() {
    super('mongo-crud1', 'testingdb', testingdb); //we then pass our schema here as the 3rd argument
  }
  getStuff() {
    return this.find().exec();
  }
  adduser(document, callback) {
    return this.insert(document, callback);
  }
}
