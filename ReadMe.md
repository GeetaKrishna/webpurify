Steps to recreate the environment:
1. Install Node JS and MYSQL.
2. unzip the code and move to the folder where package.json exists.
3. Run `npm install` command to install dependencies.
4. Run `node index.js` or `npm start` to run the node server in local environment.

TASK-2:
Index.html is the task 2 page that has Registration API integrated to it.
Registration API gets the data from index.html form and stores the data in database.
Registration API is present in index.js file that is integrated to Mysql database.

After succesful registration, a token is sent to the user to access the alloOrDisallow API.

Task-1:
A table with allowed and blocked list of contacts is present in database.
User accesses the `http://localhost:4000/allowOrBlock` by sending the token obtained during registration,
    along with the body
     `{
        "status": "allow" 
    }` to get details of allowed list of contacts,

    {
        status: "disallow"
    } to get the blocked list of details