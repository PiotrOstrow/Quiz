const express = require("express")
const app = express()

const HTTP_PORT = 3000;

app.listen(HTTP_PORT, () => {
    console.log('Server running on port ' + HTTP_PORT)
});


app.get('/', (request, response) => {
    response.json({msg: 'Hello world'});
})