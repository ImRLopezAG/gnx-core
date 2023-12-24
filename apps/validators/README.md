# 📝 Fluent Validations

Fluent Validations is a library that allows you to create validations for your entities  and properties in a simple way.


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

```ts
import { FluentValidation } from '@gnx-utilities/validators'

const email =  'test@test.test'

const validation = FluentValidation
    .create()
    .for({value: email })
    .isRequired()
    .isEmail()


console.log(validation.validate()) // true

console.log(validation.softValidation()) // { isValid: true, errors: [], totalErrors: 0 }

console.log(validation.getErrors()) // []

const wrongValidation = FluentValidation
    .create()
    .for({value: 'John Doe' })
    .isEmail()

console.log(wrongValidation.validate()) // false

console.log(wrongValidation.softValidation()) // { isValid: false, errors: [ 'The value is not a valid email' ], totalErrors: 1 } 

console.log(wrongValidation.getErrors()) // [ 'The value is not a valid email' ]
```

```ts
import { ModelValidator } from '@gnx-utilities/validators'

const user = {
    name: 'John',
    email: 'test@test.test',
    age: 20
}
const validation = ModelValidator
    .create()
    .for({model: user })
    .withProperty(({ name }) => name === 'John')
    .withProperty(({ email }) => email === 'test@test.test')
    .withProperty(({ age }) => age === 20)

console.log(validation.validate()) // true

console.log(validation.softValidation()) // { isValid: true, errors: [], totalErrors: 0 }

console.log(validation.getErrors()) // []

const wrongValidation = ModelValidator
    .create()
    .for({model: user })
    .withProperty(({ name }) => name === 'Jane')
    .withProperty(({ email }) => email === 'testing@test.com')
    .withProperty(({ age }) => age === 50)

console.log(wrongValidation.validate()) // false

console.log(wrongValidation.softValidation()) // { isValid: false, errors: [ 'The property name is not valid', 'The property email is not valid', 'The property age is not valid' ], totalErrors: 3 }

console.log(wrongValidation.getErrors()) // [ 'The property name is not valid', 'The property email is not valid', 'The property age is not valid' ]
```

## 📝 Documentation

[![Documentation](https://img.shields.io/badge/Documentation-000000?style=for-the-badge&logo=read-the-docs&logoColor=white)](https://gnx-udocs.vercel.app)


### 🛠️ Tools


[![Typescript](https://img.shields.io/badge/Typescript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NodeJS](https://img.shields.io/badge/NodeJS-339933?logo=node.js&logoColor=white)](https://nodejs.org/es/)


## Authors

[![ImRLopezAG](https://img.shields.io/badge/ImRLopezAG-000000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ImRLopezAG)

## 🔗 Links

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://imrlopez.dev)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/angel-gabriel-lopez/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/imr_lopez)
