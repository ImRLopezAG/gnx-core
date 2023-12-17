import { pre, prop } from '@typegoose/typegoose'
import { Document, ObjectId } from 'mongoose'

/**
 * @classdesc TypegooseBaseEntity is an abstract class that extends the Typegoose Document class.
 * It is used to define the common properties of all Typegoose entities.
 * You need to provide your own properties and methods to extend this class.
 * @example
 * import { TypegooseBaseEntity } from '@services/generic-services'
 * import { getModelForClass, prop } from '@typegoose/typegoose'
 *
 * export class Entity extends TypegooseBaseEntity {
 *   // @prop({ required: true }) The @prop decorator is used to define the properties of the entity.
 *   declare name: string
 * }
 *
 * export const EntityModel = getModelForClass(Entity)
 */

@pre<TypegooseBaseEntity>('findOneAndUpdate', function (next) {
  this.$set({ updatedAt: new Date().toISOString() })
  next()
})
export abstract class TypegooseBaseEntity extends Document {
  @prop()
  declare _id: ObjectId

  @prop({ default: () => new Date().toISOString() })
  declare createdAt: Date

  @prop({ default: () => new Date().toISOString() })
  declare updatedAt: Date
}
