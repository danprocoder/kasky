# node-api-framework

#### Installation
`npm install -g pretty-api` or `yarn add -g pretty-api`

#### Create a new Project
`pretty-api init your_project_name`

#### Create a controller
The follow command will create a new controller class file.

`pretty-api make:controller --name=ControllerClassName`

An example controller class.
```javascript
import { Controller } from 'pretty-api';

@Controller()
class MyFirstController {}

export default MyFirstController;
```

#### Define Routes
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

#### Create a model class.
The follow command will create a model class file.

`pretty-api make:model --name=YourModelClassName --table=your_database_table_name`

Example:

`pretty-api make:model --name=UsersModel --table=users`

The following file will be generated.
```javascript
import { Model } from 'pretty-api';

@Model({
  table: 'your_database_table_name'
})
class UserModel {}

export default UserModel;
```
