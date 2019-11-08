# pretty-api framework for node.js

[![CircleCI](https://circleci.com/gh/danprocoder/node-api-framework.svg?style=svg)](https://circleci.com/gh/danprocoder/node-api-framework) [![codecov](https://codecov.io/gh/danprocoder/node-api-framework/branch/development/graph/badge.svg)](https://codecov.io/gh/danprocoder/node-api-framework)

This project is still under development and first version will be published soon.

## Installation
Using npm:
```bash
npm install -g pretty-api
```

Using yarn:
```bash
yarn add -g pretty-api
```


## Create a new Project
```bash
pretty-api init your_project_name
```

The above command will create a new folder named `your_project_name` in the current working directory with some files and folders created inside it. Below is what the folder structure of the new created `your_project_name` folder will look like.

```text
|__src
| |__database
| | |__migrations
| |__middlewares
| |__models
| |__controllers
| |__app.js
|__jsconfig.json
|__.gitignore
|__package.json
|__app.config.json
```

#### Work with other programming languages.
To create a project using the [typescript](https://www.typescriptlang.org/) programming language, use:  
```bash
pretty-api init your_project_name --typescript
```

To create a project using the [coffee script](https://coffeescript.org/) programming language, use:  
```bash
pretty-api init your_project_name --coffee-script
```

## Create a controller
The follow command will create a new controller class file.

```bash
pretty-api make:controller --name=ControllerClassName
```

An example controller class.
```javascript
import { Controller } from 'pretty-api';

@Controller()
class MyFirstController {}

export default MyFirstController;
```


## Define Routes
```javascript
import { Controller, Route } from 'pretty-api';

@Controller()
class MyFirstController {
  
  @Route.Post('/api/blog')
  createBlog(req, res) {
    res.created('Route to create blog');
  }
  
  @Route.Get('/api/blog')
  getAllBlogs(req, res) {
    res.success('Route to get all blogs');
  }
}

export default MyFirstController;
```


## Create a model class.
The follow command will create a model class file.

```bash
pretty-api make:model --name=YourModelClassName --table=your_database_table_name
```

Example:

```bash
pretty-api make:model --name=UsersModel --table=users
```

The following file will be generated.
```javascript
import { Model } from 'pretty-api';

@Model({
  table: 'your_database_table_name'
})
class UserModel {}

export default UserModel;
```
