import { Model } from 'sequelize'
import type { Id } from './types'

/**
 * @classdesc SequelizeBaseEntity is an abstract class that extends the Sequelize Model class.
 * It is used to define the common properties of all Sequelize entities.
 * You need to provide your own properties and methods to extend this class.
 * @example
 * import { SequelizeBaseEntity } from '@services/generic-services'
 * import { DataTypes } from 'sequelize'
 *
 * export class Entity extends SequelizeEntity {
 *  declare id: number
 *  declare name: string
 *  declare createdAt: Date
 *  declare updatedAt: Date
 * }
 *
 * Entity.init({
 *  id: {
 *    type: DataTypes.INTEGER.UNSIGNED,
 *    autoIncrement: true,
 *    primaryKey: true,
 *  },
 *  name: {
 *    type: DataTypes.STRING,
 *    allowNull: false,
 *  },
 * }, {
 *    sequelize,
 *    tableName: 'entities',
 *    timestamps: true,
 * })
 */

export abstract class SequelizeBaseEntity extends Model {
  public id: Id
  public createdAt: Date
  public updatedAt: Date
  public isDeleted: boolean
}
