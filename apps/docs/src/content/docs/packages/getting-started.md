---
title: GNX - Utilities
description: GNX is a collect of utilities that are used across all of our projects. It is a collection of utilities that we have found useful in our projects and we hope you will find them useful in yours. We have tried to make them as generic as possible so that they can be used in any project.
---

GNX is a collection of packages that can be used together or separately. The core package isn't required to use the other packages, but each package has a peer dependency on some of the other packages. For example, the `@gnx-utilities/services` package has a peer dependency on the `@gnx-utilities/models` package. This means that you can install the `@gnx-utilities/services` package without installing the `@gnx-utilities/models` package, but you will get an error if you try to use the `@gnx-utilities/services` package without installing the `@gnx-utilities/models` package.

:::tip[Good to know]
Our models are base on `ODM` and `ORM` packages. We have created a `mongoose` entity and a `sequelize` entity which will help you to manage many `SQL` and `NoSQL` databases.
:::

## Packages

### Core

The core package is the base package for all the other packages. It contains the base classes and interfaces that are used by the other packages. It also contains the `@gnx-utilities/core` package, which is used to create decorators for `repositories` and `services`.

### Models

The models package contains the base classes and interfaces that are used to create models. It also contains the `@gnx-utilities/sequelize` and `@gnx-utilities/mongoose` packages, which are used to create models for `SQL` and `NoSQL` databases.

### Services

The services package contains the base classes and interfaces that are used to create services.

### Decorators

The decorators package contains the base classes and interfaces that are used to create decorators. It also contains the `@gnx-utilities/decorators` package, which is used to create decorators for `repositories` and `services`.

### Validators

The validators package contains the base classes and interfaces that are used to create validators. It also contains the `@gnx-utilities/validators` package, which is used to create validators for every property or value it doesn't mater if it is a `repository` or `service` or your own custom implementation.
