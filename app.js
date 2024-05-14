// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Connect to MongoDB
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/formdata')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


// Define a Mongoose Schema for form submissions
const formDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String
});

// Create a Mongoose model based on the schema
const FormData = mongoose.model('FormData', formDataSchema);

// Route to render the contact form
app.get('/', (req, res) => {
  res.redirect('/contact'); // Redirect to the contact form
});

// Route to render the contact form
app.get('/contact', (req, res) => {
  res.render('contact', { errors: null }); // Pass errors object (null for now)
});

// Route to handle form submissions
app.post('/send', (req, res) => {
  // Extract form data from request body
  const { name, email, subject, message } = req.body;

  // Create a new FormData document
  const formData = new FormData({ name, email, subject, message });

  // Save the form data to MongoDB
  formData.save()
    .then(() => {
      res.send('Form submission successful!');
    })
    .catch((err) => {
      res.status(500).send('Error occurred while submitting the form.');
      console.error(err);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
