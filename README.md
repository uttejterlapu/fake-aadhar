# Aadhaar API Documentation

## Overview

This project is an Express.js application that provides an API for managing Aadhaar data and user authentication. It includes routes for creating, retrieving, and deleting Aadhaar records, as well as user registration. The application utilizes middleware for API key validation and sends an API key to users upon registration.

## Table of Contents

- [Aadhaar API Documentation](#aadhaar-api-documentation)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [API Endpoints](#api-endpoints)
    - [User Registration](#user-registration)
    - [Aadhaar Management](#aadhaar-management)
    - [Example Request](#example-request)
  - [Usage](#usage)
  - [License](#license)

## Installation

To set up this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```plaintext
   PORT=<your-port>
   MONGOURL=<your-mongo-db-url>
   EMAIL_USER=<your-email>
   EMAIL_PASS=<your-email-password>
   ```

4. **Run the application**:
   ```bash
   npm start
   ```

## Environment Variables

The application requires the following environment variables to function properly:

| Variable     | Description                          |
|--------------|--------------------------------------|
| `PORT`      | The port on which the server will run. Default is usually 3000. |
| `MONGOURL`  | The connection string for your MongoDB database. |
| `EMAIL_USER`| The email address used to send API keys. |
| `EMAIL_PASS`| The password for the email account. |

## API Endpoints

### User Registration

- **POST** `/api/auth/register`
  - Registers a new user and sends an API key to the provided email address.

### Aadhaar Management

- **GET** `/api/aadhaar/all?api_key={{apikey}}`
  - Retrieves all Aadhaar records. Requires an API key in the query string.

- **POST** `/api/aadhaar?api_key={{apikey}}`
  - Creates a new Aadhaar record. Requires an API key in the query string.

- **GET** `/api/aadhaar/:aadhaarNumber?api_key={{apikey}}`
  - Retrieves a specific Aadhaar record by its number. Requires an API key in the query string.

- **DELETE** `/api/aadhaar/:aadhaarNumber?api_key={{apikey}}`
  - Deletes a specific Aadhaar record by its number. Requires an API key in the query string.

### Example Request

To access a specific Aadhaar record, use the following format:

```plaintext
{{BACKEND}}/api/aadhaar/6545722136037113?api_key={{apikey}}
```

Replace `{{BACKEND}}` with your server's URL and `{{apikey}}` with the API key sent to your email upon registration.

## Usage

1. Register a new user by sending a POST request to `/api/auth/register` with the user's details.
2. After successful registration, check your email for the API key.
3. Use the API key in the query string for all requests to the Aadhaar endpoints.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to customize this README to better fit your project's needs! If you have any questions or need further assistance, don't hesitate to ask.