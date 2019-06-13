# GraphQL Node Tutorial
This is a project following the GraphQL and Node Tutorial from http://www.howtographql.com/graphql-js

## To Install
* Clone this repository
* Navigate into the root directory
* Run `npm install` to install dependencies
* Run `npm start` to start the project
* Open a browser window to `localhost:4000` to start the GraphQL Playground

## Example Commands

**Get All Links**
```
query {
  feed {
    links {
      id
      description
      url
    }
  }
}
```

**Post New Link**
```
mutation {
  post(
    url: "www.test.com"
    description: "This is only a test"
  ) {
    id
  }
}
```
