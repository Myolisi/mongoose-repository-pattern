import { Typegoose } from 'typegoose';
export default interface IConstructor<T extends Typegoose> {
  new (): T extends Typegoose ? Typegoose : any;
}
