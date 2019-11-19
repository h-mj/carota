![Application](https://i.imgur.com/NoVv7Eq.gif)

# Carota

Full stack calorie counting web application built with TypeScript.

# Technologies

Technologies that make Carota work:

- [Nest](https://github.com/nestjs/nest) and [TypeORM](https://github.com/typeorm/typeorm) at the back.
- [React](https://github.com/facebook/react), [styled-components](https://github.com/styled-components/styled-components) and [MobX](https://github.com/mobxjs/mobx) at the front.
- [TypeScript](https://github.com/microsoft/typeScript) on both ends.

# Configuration

1. Make a copy of `packages/server/.example.env` and rename it to `.env`. Replace `{placeholder}` values with your appropriate values.
2. Enable `uuid-ossp` extension on your database if not already enabled.
3. Create registration invitation manually by inserting `(default, 'Adviser', 'All', null, null)` values into `invitation` table.
4. Go to `/register/{invitationId}` where `{invitationId}` is created invitation ID to create an administrator account.

# Quick start

```sh
# install dependencies
yarn

# and start development mode
yarn develop
```

# Demo

You can try out this application at [this link](https://morkovka2.herokuapp.com) by signing in using email `demo@example.com` and password `demodemo`.
