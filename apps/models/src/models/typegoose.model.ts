import { pre, prop } from '@typegoose/typegoose'
import type { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { Document } from 'mongoose'

/**
 * @classdesc TypegooseBaseEntity is an abstract class that extends the Typegoose Document class.
 * It is used to define the common properties of all Typegoose entities.
 * You need to provide your own properties and methods to extend this class.
 * @example
 * import { TypegooseBaseEntity } from '@services/generic-services'
 * import { getModelForClass, prop } from '@typegoose/typegoose'
 *
 * export class Entity extends TypegooseBaseEntity {
 *   .@prop({ required: true, type: String }) // The .@prop decorator is used to define the properties of the entity.
 *   declare name: string
 * }
 *
 * export const EntityModel = getModelForClass(Entity)
 * @todo You need to provide the type of the properties of the entity as in the example.
 */

@pre<TypegooseBaseEntity>('findOneAndUpdate', function (next) {
  this.updatedAt = new Date()
  next()
})
export abstract class TypegooseBaseEntity extends Document implements TimeStamps {
  @prop({ default: () => new Date(), type: Date })
  declare createdAt: Date

  @prop({ default: () => new Date(), type: Date })
  declare updatedAt: Date

  @prop({ default: false, type: Boolean })
  declare isDeleted: boolean
}
