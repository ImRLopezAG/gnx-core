import assert from 'node:assert'
import { describe, it } from 'node:test'
import { ModelValidator } from '../src/validations/model-validator'
import { FluentValidation } from '../src/validations/validator'

await describe('FluentValidation', async () => {
  const fluentValidations = FluentValidation.create().for({ value: 'test' })

  await it('should be email', () => {
    assert.strictEqual(
      fluentValidations.isEmail().getValidations().get('isEmail'),
      false
    )
  })

  await it('should be url', () => {
    assert.strictEqual(
      fluentValidations.isURL().getValidations().get('isURL'),
      false
    )
  })

  await it('should be gmail', () => {
    assert.strictEqual(
      fluentValidations.isGmail().getValidations().get('isGmail'),
      false
    )
  })

  await it('should be outlook', () => {
    assert.strictEqual(
      fluentValidations.isOutlook().getValidations().get('isOutlook'),
      false
    )
  })

  await it('should be date', () => {
    assert.strictEqual(
      fluentValidations.isDate().getValidations().get('isDate'),
      false
    )
  })

  await it('should be string', () => {
    assert.strictEqual(
      fluentValidations.isString().getValidations().get('isString'),
      true
    )
  })

  await it('should be boolean', () => {
    assert.strictEqual(
      fluentValidations.isBoolean().getValidations().get('isBoolean'),
      false
    )
  })

  await it('should be array', () => {
    assert.strictEqual(
      fluentValidations.isArray().getValidations().get('isArray'),
      false
    )
  })

  await it('should be object', () => {
    assert.strictEqual(
      fluentValidations.isObject().getValidations().get('isObject'),
      false
    )
  })

  await it('should be function', () => {
    assert.strictEqual(
      fluentValidations.isFunction().getValidations().get('isFunction'),
      false
    )
  })

  await it('should be undefined', () => {
    assert.strictEqual(
      fluentValidations.isUndefined().getValidations().get('isUndefined'),
      false
    )
  })

  await it('should be number', () => {
    assert.strictEqual(
      fluentValidations.isNumber().getValidations().get('isNumber'),
      false
    )
  })

  await it('should be equal to', () => {
    assert.strictEqual(
      fluentValidations
        .isEqualTo({ value: 'test' })
        .getValidations()
        .get('isEqualTo'),
      true
    )
  })

  await it('should be not equal to', () => {
    const validation = FluentValidation.create().for({ value: 'test' })
    assert.strictEqual(
      validation
        .isEqualTo({ value: 'test1' })
        .getValidations()
        .get('isEqualTo'),
      false
    )
  })

  await it('should be greater than', () => {
    const validation = FluentValidation.create().for({ value: 6 })
    assert.strictEqual(
      validation
        .isGreaterThan({ value: 5 })
        .getValidations()
        .get('isGreaterThan'),
      true
    )
  })
})

await describe('ModelValidator', async () => {
  const user = {
    name: 'test',
    age: 20
  }
  await it('should return is valid', () => {
    const validate = ModelValidator.create()
      .for({ model: user })
      .withProperty((user) => user.name === 'test')
      .validate()
    assert.strictEqual(validate, true)
  })

  await it('should return is not valid', () => {
    const validate = ModelValidator.create()
      .for({ model: user })
      .withProperty((user) => user.name === 'test1')
      .validate()
    assert.strictEqual(validate, false)
  })

  await it('should return invalid validations', () => {
    const validate = ModelValidator.create()
      .for({ model: user })
      .withProperty((user) => user.name === 'test1')
      .getErrors()
    assert.strictEqual(validate.length, 1)
  })

  await it('should return validations', () => {
    const validate = ModelValidator.create()
      .for({ model: user })
      .withProperty((user) => user.name === 'test1')
      .getValidations()
    assert.strictEqual(validate.size, 1)
  })

  await it('should be greater than', () => {
    const validate = ModelValidator.create()
      .for({ model: user })
      .withProperty(({ age }) => age > 10)
      .validate()
    assert.strictEqual(validate, true)
  })
})
