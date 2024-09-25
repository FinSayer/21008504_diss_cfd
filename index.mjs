// ECMAScript modules
import express, { request, response } from 'express';
// Invoke function
const app = express();
// Render using .ejs
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
    response.render("main");
})

// Enable public directory as static
app.use(express.static('public'));


// Assign port to environment variable PORT or default to 3000
const PORT = process.env.PORT || 3000;
// Listen for incoming HTTP requests
app.listen(PORT, () => {
    console.log('Go to http://localhost:'+PORT);
});

