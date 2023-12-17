---
title: Validators
description: GNX is a collect of utilities that are used across all of our projects. It is a collection of utilities that we have found useful in our projects and we hope you will find them useful in yours. We have tried to make them as generic as possible so that they can be used in any project.
---

# 📝 Fluent Validations

Fluent Validations is a library that allows you to create validations for your entities and properties in a simple way.

## 📦 Installation

```bash
npm install @gnx-utilities/validators
```

```bash
pnpm add @gnx-utilities/validators
```

```bash
yarn add @gnx-utilities/validators
```

```bash
bun add @gnx-utilities/validators
```

## 📖 Usage

### Properties validation

```ts
import { FluentValidation } from '@gnx-utilities/validators'

const email = 'test@test.test'

const validation = FluentValidation.create()
  .for({ value: email })
  .isRequired()
  .isEmail()

console.log(validation.validate()) // true

console.log(validation.softValidation()) // { isValid: true, errors: [], totalErrors: 0 }

console.log(validation.getErrors()) // []

const wrongValidation = FluentValidation.create()
  .for({ value: 'John Doe' })
  .isEmail()

console.log(wrongValidation.validate()) // false

console.log(wrongValidation.softValidation()) // { isValid: false, errors: [ 'The value is not a valid email' ], totalErrors: 1 }

console.log(wrongValidation.getErrors()) // [ 'The value is not a valid email' ]
```

### Model validation

```ts
import { ModelValidator } from '@gnx-utilities/validators'

const user = {
  name: 'John',
  email: 'test@test.test',
  age: 20
}
const validation = ModelValidator.create()
  .for({ model: user })
  .withProperty(({ name }) => name === 'John')
  .withProperty(({ email }) => email === 'test@test.test')
  .withProperty(({ age }) => age === 20)

console.log(validation.validate()) // true

console.log(validation.softValidation()) // { isValid: true, errors: [], totalErrors: 0 }

console.log(validation.getErrors()) // []

const wrongValidation = ModelValidator.create()
  .for({ model: user })
  .withProperty(({ name }) => name === 'Jane')
  .withProperty(({ email }) => email === 'testing@test.com')
  .withProperty(({ age }) => age === 50)

console.log(wrongValidation.validate()) // false

console.log(wrongValidation.softValidation()) // { isValid: false, errors: [ 'The property name is not valid', 'The property email is not valid', 'The property age is not valid' ], totalErrors: 3 }

console.log(wrongValidation.getErrors()) // [ 'The property name is not valid', 'The property email is not valid', 'The property age is not valid' ]
```
