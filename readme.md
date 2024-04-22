# Form Submission Backend

This project provides a backend server for handling form submissions with reCAPTCHA verification.

## Prerequisites

Before running the server, make sure you have the following installed:

- Node.js
- MongoDB

## Getting Started

1. Clone the repository:


2. Install dependencies:


3. Create a `.env` file in the root directory of the project and define the following environment variables:


Replace `<SECRET_KEY>` with your actual reCAPTCHA secret key.
Replace `<DATABASE_URL>` with your DataBase URl.

4. Start the server:


## Endpoints

### POST /api/submit-form

- Accepts form data in JSON format.
- Verifies reCAPTCHA using the provided secret key.
- Saves the form data to the MongoDB database if reCAPTCHA verification succeeds.

### GET /download-csv

- Retrieves form data from the MongoDB database and returns it as a CSV file for download.

## Technologies Used

- Express.js: Backend framework for handling HTTP requests.
- MongoDB: NoSQL database for storing form data.
- Mongoose: MongoDB object modeling for Node.js.
- Axios: HTTP client for making requests to reCAPTCHA API.
- dotenv: Environment variable management.

## Contributing

Contributions are welcome! Please follow the standard GitHub flow:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/new-feature`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/new-feature`)
6. Create a new pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

