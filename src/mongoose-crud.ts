import {
  Schema,
  Document,
  DocumentQuery,
  Model,
  createConnection,
  connections,
  Error,
  SaveOptions,
  pluralize,
  Connection
} from 'mongoose';
import { connectionPool } from './connection';
import IConstructor from './IConstructor';
import { Typegoose } from 'typegoose';

//desable pluralization on tables
pluralize(null);
export let dbconnections = {};
export abstract class CRUD<T extends Typegoose> {
  private database: string;
  private collection: string;
  private models!: Model<Document>;
  private document!: T extends Typegoose ? Typegoose : any;
  private schema = new Schema();

  /**
   * Creates an instance of MongoBase.
   * @param {string} database
   * @param {string} collection
   * @param {IConstructor<T extends Typegoose ? Typegoose : any>} document if a Typegoose class is defined, thus create an empty [schema]
   * @memberof MongoBase
   */
  constructor(database: string, collection: string, document?: IConstructor<T extends Typegoose ? Typegoose : any>) {
    this.database = database;
    this.collection = collection;
    // check if a model is passed else create an empty schema
    !document ? (this.models = this.connect(database).model(collection, new Schema({}))) : this.createModel(document);
  }

  /**
   * Switch/connect to a database
   * @returns mongoose connection
   * @memberof MongoBase
   */
  private connect(database: string) {
    for (let i = 0; i < connectionPool.length; i++) {
      console.log(i);
      return createConnection(`${connectionPool[i].url}${database}`, connectionPool[i].options);
    }
  }

  /**
   * creates the model for the connection
   * @returns {Model<Document, {}>} Model
   * @memberof MongoBase
   */
  private createModel(document: IConstructor<T extends Typegoose ? Typegoose : any>) {
    return (this.models = new document().getModelForClass(document, {
      existingConnection: this.connect(this.database)
    }));
  }

  /**
   * find documents
   * @param {(err: Error, res: Document[]) => void} callback
   * @param {number} [limit] maximum number of documents the query should return
   * @returns {DocumentQuery<Document[], Document, {}>} Plain JavaScript objects
   * @memberof MongoBase
   * @chainables sort(), limit() exec(callcaback) ...... etc, can use query builder functions like where() equals() etc see (@link class: https://mongoosejs.com/docs/queries.html )
   */
  public find(
    conditions?: any,
    callback?: (err: Error, res: Document[]) => void,
    projection?: any,
    limit?: number
  ): DocumentQuery<Document[], Document> {
    let queryResults!: DocumentQuery<Document[], Document>;
    const limitCond = !limit ? 0 : limit;
    const projections = !projection ? '' : projection;

    if (conditions) {
      queryResults = this.models
        .find(conditions, callback, projections)
        .limit(limitCond)
        .lean();
    } else {
      queryResults = this.models
        .find(callback, projections)
        .limit(limitCond)
        .lean();
    }

    return queryResults;
  }

  /**
   * Update document
   * @param {*} condition
   * @param {*} document
   * @param {boolean} [returnUpdatedDoc] return updated document
   * @param {(err?: Error, data?: any) => void} [callback]
   * @param {*} [options] custom options
   * @returns DocumentQuery
   * @memberof MongoBase
   */
  public update(
    condition: any,
    document: any | T,
    returnUpdatedDoc?: boolean,
    callback?: (err?: Error, data?: any) => void,
    options?: any
  ) {
    let update;
    if (options) update = this.models.updateOne(condition, document, options, callback);
    else if (returnUpdatedDoc)
      update = this.models.findOneAndUpdate(
        condition,
        document,
        {
          strict: false, // update field not defined in the schema
          new: true
        },
        callback
      );
    else
      update = this.models.updateOne(
        condition,
        document,
        {
          strict: false,
          new: true
        },
        callback
      );
    return update;
  }

  /**
   * Finds the distinct values for a specified field
   * @param {string} fields
   * @param {object} [optionalQuery] - optional query for distict results
   * @returns {DocumentQuery<Document[], Document, {}>}
   * @memberof MongoBase
   */
  public distinct(field: string, optionalQuery?: object): DocumentQuery<Document[], Document> {
    let queryResults!: DocumentQuery<Document[], Document>;

    if (optionalQuery) queryResults = this.models.distinct(field, optionalQuery).lean();
    else queryResults = this.models.distinct(field).lean();
    return queryResults;
  }

  /**
   *
   * @param {(err: any, product: this) => void} [fn] optional callback function
   * @param {SaveOptions} [options] save options
   * @returns {Promise<Document>}
   * @memberof MongoBase
   */
  public async insert(
    document,
    callback,
    fn?: (err: any, product: this) => void,
    options?: SaveOptions
  ): Promise<Document> {
    let res;
    let erro;
    const doc = new this.models(document);
    if (options) {
      doc.save(options, (err: any, product: Document) => {
        if (!err) return product;
        else return err;
      });
    } else {
      await doc.save(callback);
    }
    return res;
  }
}
