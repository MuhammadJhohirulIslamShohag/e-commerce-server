# Aladin E-Commerce Project

## Description

The Aladin E-Commerce Project is an ambitious initiative aimed at creating a comprehensive online platform to facilitate buying and selling of products and services. The goal is to develop a user-friendly, scalable, and secure e-commerce website that caters to a wide range of customers, providing them with a seamless online shopping experience.

## Documentation

[Swagger Documentation Link](http://54.204.167.67/api-doc/ )



## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Endpoints](#endpoints)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Installation

_Clone the repository:_

```bash
git clone https://github.com/MuhammadShohagIslam/e-commerce-server.git

Navigate The Project Directory:
cd cd Modular-Monolith

Install The Dependencies:
yarn install or yarn

```

## Usage

If you want to run project, first create new file like .env file in your root folder project

```plaintext
    make file into => .env

    # MongoDB connection string for authentication service
    MONGO_URL='mongodb+srv://<username>:<password>@cluster0.flvds.mongodb.net/<dbname>?retryWrites=true&w=majority'

    # Application port
    PORT=9000

    # Environment (development, production, etc.)
    NODE_ENV="development"

    # Bcrypt settings for password hashing
    BCRYPT_SALT_ROUNDS=12

    # JWT settings
    JWT_SECRET='your-jwt-secret'
    JWT_EXPIRE_IN=1d
    JWT_REFRESH_SECRET='your-jwt-refresh-secret'
    JWT_REFRESH_EXPIRE_IN=356d


    # Stripe API secret key
    STRIPE_SECRET_KEY='your-stripe-secret-key'

    # Email for notifications or other purposes
    EMAIL="your-email@example.com"

    # AWS configuration
    AWS_ACCESS_KEY_ID="your-aws-access-key-id"
    AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
    AWS_BUCKET_NAME="your-aws-bucket-name"
    AWS_BUCKET_REGION="us-east-1"
    AWS_REGION="us-east-1"

```

```command
    * yarn run dev ( server running with DB_DEV=mongodb+srv://<username>:<password>@cluster0.flvds.mongodb.net/<dbname>?retryWrites=true&w=majority )

    * yarn run local ( server running with DB_LOCAL='mongodb://localhost:27017/db_name' )

    * yarn run live ( server running with DB_LIVE=mongodb+srv://<username>:<password>@cluster0.flvds.mongodb.net/<dbname>?retryWrites=true&w=majority )

    Your server will be running at http://localhost:9000 by default.

```

## Configuration

Without .env file, we have nothing to do with configuration, just copy the value of the env variable and past with .env file

### Environment Variable File look Like Below

```plaintext
    # MongoDB connection string for authentication service
    MONGO_URL='mongodb+srv://<username>:<password>@cluster0.flvds.mongodb.net/<dbname>?retryWrites=true&w=majority'

    # Application port
    PORT=9000

    # Environment (development, production, etc.)
    NODE_ENV="development"

    # Bcrypt settings for password hashing
    BCRYPT_SALT_ROUNDS=12

    # JWT settings
    JWT_SECRET='your-jwt-secret'
    JWT_EXPIRE_IN=1d
    JWT_REFRESH_SECRET='your-jwt-refresh-secret'
    JWT_REFRESH_EXPIRE_IN=356d


    # Stripe API secret key
    STRIPE_SECRET_KEY='your-stripe-secret-key'

    # Email for notifications or other purposes
    EMAIL="your-email@example.com"

    # AWS configuration
    AWS_ACCESS_KEY_ID="your-aws-access-key-id"
    AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
    AWS_BUCKET_NAME="your-aws-bucket-name"
    AWS_BUCKET_REGION="us-east-1"
    AWS_REGION="us-east-1"
```

## Endpoints

In the below, we can see list of the endpoint includes examples of requests and responses.

```code
    BaseURL: http://localhost:9000/
```

### Authentication

### Endpoint 1:

- Method: POST
- Path: api/v1/auth/login
- Description: User login for website
- Example:

```curl
    Curl  api/v1/auth/login

    Body:
            {
                "email": "abc@abc.com",
                "pass": "abc!1234"
            }

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": "User logged successfully!",
                "data": {
                    "accessToken": "token_string",
                    "userInfo": {...data}
                }
            }

```

### Endpoint 2:

- Method: POST
- Path: api/v1/auth/register
- Description: User create for website
- Example:

```curl
    Curl  api/v1/auth/register

    Body:
            {
                "name": "abc",
                "email": "abc@abc.com",
                "password": "abc!"
            }

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": "User Register successfully!",
                "data": {
                    "accessToken": "token_string",
                    "userInfo": {...data}
                }
            }

```

### Endpoint 3:

- Method: POST
- Path: api/v1/auth/refresh-token
- Description: we can make refresh token for website, if token will be expire
- Example:

```curl
    Curl  api/v1/auth/refresh-token

    Body:
            {
                "cookies":{
                    "refreshToken":"token_string"
                }
            }
    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": "Access token created successfully!",
                "data": {
                    "accessToken": "token_string"
                }
            }

```

### Endpoint 4:

- Method: GET
- Path: api/v1/auth/refresh-token
- Description: we can make refresh token for website, if token will be expire
- Example:

```curl
    Curl  api/v1/auth/refresh-token

    Body:
            {
                "cookies":{
                    "refreshToken":"token_string"
                }
            }
    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": "Access token created successfully!",
                "data": {
                    "accessToken": "token_string"
                }
            }

```

### User

### Endpoint 5:

- Method: GET
- Path: api/v1/users
- Description: we can get all users
- Example:

```curl
    Curl  api/v1/users

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'Get All Users Successfully!',
                "data": [
                    {
                        ...data
                    }
                ]
            }

```

### Endpoint 6:

- Method: GET
- Path: api/v1/users/659a62fc30bcd900689e2e54
- Description: we can get single user
- Example:

```curl
    Curl  api/v1/users/659a62fc30bcd900689e2e54

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'Get Single User Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

### Endpoint 7:

- Method: PATCH
- Path: api/v1/users/659a62fc30bcd900689e2e54
- Description: we can update single user
- Example:

```curl
    Curl  api/v1/users/659a62fc30bcd900689e2e54

    Body(form data):
        profileImage
        name:

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'User Updated Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

### Endpoint 8:

- Method: DELETE
- Path: api/v1/users/659a62fc30bcd900689e2e54
- Description: we can delete single user
- Example:

```curl
    Curl  api/v1/users/659a62fc30bcd900689e2e54

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'User Removed Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

### Category

### Endpoint 9:

- Method: POST
- Path: api/v1/categories
- Description: we can create new video
- Example:

```curl
    Curl  api/v1/categories

    form-data:
        {
            "name": "computer",
            "categoryImage": image file,
        }

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'Category Created Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

### Endpoint 10:

- Method: GET
- Path: api/v1/categories
- Description: we can get all categories
- Example:

```curl
    Curl  api/v1/categories

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'All Categories Retrieved Successfully!',
                "data": [
                    {
                        ...data
                    }
                ]
            }

```

### Endpoint 11:

- Method: GET
- Path: api/v1/categories/659a62fc30bcd900689e2e54
- Description: we can get single category
- Example:

```curl
    Curl  api/v1/categories/659a62fc30bcd900689e2e54

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'Single Category Retrieved Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

### Endpoint 12:

- Method: PATCH
- Path: api/v1/categories/659a62fc30bcd900689e2e54
- Description: we can update single video
- Example:

```curl
    Curl  api/v1/categories/659a62fc30bcd900689e2e54

    form-data:
        {
            "title": "----",
            "description": "----"
        }

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'Category Updated Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

### Endpoint 13:

- Method: DELETE
- Path: api/v1/categories/659a62fc30bcd900689e2e54
- Description: we can delete single video
- Example:

```curl
    Curl  api/v1/categories/659a62fc30bcd900689e2e54

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'Video Removed Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

### Sub Category

### Endpoint 14:

- Method: POST
- Path: api/v1/sub-categories
- Description: we can create new sub-category
- Example:

```curl
    Curl  api/v1/sub-categories

    form-data:
        {
            "name": "computer",
            "subCategoryImage": image file,
        }

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'Sub Category Created Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

### Endpoint 15:

- Method: GET
- Path: api/v1/sub-categories
- Description: we can get all sub categories
- Example:

```curl
    Curl  api/v1/sub-categories

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'All Sub Categories Retrieved Successfully!',
                "data": [
                    {
                        ...data
                    }
                ]
            }

```

### Endpoint 16:

- Method: GET
- Path: api/v1/sub-categories/659a62fc30bcd900689e2e54
- Description: we can get single sub category
- Example:

```curl
    Curl  api/v1/sub-categories/659a62fc30bcd900689e2e54

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'Single Sub Category Retrieved Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

### Endpoint 17:

- Method: PATCH
- Path: api/v1/sub-categories/659a62fc30bcd900689e2e54
- Description: we can update single video
- Example:

```curl
    Curl  api/v1/sub-categories/659a62fc30bcd900689e2e54

    form-data:
        {
            "title": "----",
            "description": "----"
        }

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'Sub Category Updated Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

### Endpoint 18:

- Method: DELETE
- Path: api/v1/sub-categories/659a62fc30bcd900689e2e54
- Description: we can delete sub category
- Example:

```curl
    Curl  api/v1/sub-categories/659a62fc30bcd900689e2e54

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'Sub Category Removed Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

## Advertise Banner

### Endpoint 19:

- Method: POST
- Path: api/v1/advertise-banners
- Description: we can create new category
- Example:

```curl
    Curl  api/v1/advertise-banners

    form-data:
        {
            "name": "string"
            "position": "0"
            "shareURL": "string"
            "duration": "time
            "startDate": "date"
            "endDate": "date"
            "advertiseBannerImage": image file,
        }

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'Category Created Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

### Endpoint 20:

- Method: GET
- Path: api/v1/advertise-banners
- Description: we can get all advertise-banners
- Example:

```curl
    Curl  api/v1/advertise-banners

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'All advertise-Banners Retrieved Successfully!',
                "data": [
                    {
                        ...data
                    }
                ]
            }

```

### Endpoint 21:

- Method: GET
- Path: api/v1/advertise-banners/659a62fc30bcd900689e2e54
- Description: we can get single advertise banner
- Example:

```curl
    Curl  api/v1/advertise-banners/659a62fc30bcd900689e2e54

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'Single advertise Banner Retrieved Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

### Endpoint 22:

- Method: PATCH
- Path: api/v1/advertise-banners/659a62fc30bcd900689e2e54
- Description: we can update single advertise banner
- Example:

```curl
    Curl  api/v1/advertise-banners/659a62fc30bcd900689e2e54

    Body:
       {
            "name": "string"
            "position": "0"
            "shareURL": "string"
            "duration": "time
            "startDate": "date"
            "endDate": "date"
            "advertiseBannerImage": image file,
        }

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'Advertise Banner Updated Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

### Endpoint 23:

- Method: DELETE
- Path: api/v1/advertise-banners/659a62fc30bcd900689e2e54
- Description: we can delete single advertise banner
- Example:

```curl
    Curl  api/v1/advertise-banners/659a62fc30bcd900689e2e54

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'Advertise Banner Removed Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

### Blog

### Endpoint 24:

- Method: POST
- Path: api/v1/blogs
- Description: we can create new blog
- Example:

```curl
    Curl  api/v1/blogs

    Body:
        {
            "title": "...",
            "slug": "...",
            "description": "...",
            "authorName": "...",
            "imageUrl": "...",
            "tags": [
                "...",
                "..."
            ],
            "user": {
                "name": "...",
                "email": "...",
                "phone": "...",
                "id": "..."
            },
            "categoryId": "...",
            "publishDate": "..."
        }

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'Blog Created Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

### Endpoint 25:

- Method: GET
- Path: api/v1/blogs
- Description: we can get all Blog
- Example:

```curl
    Curl  api/v1/blogs

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'All Blogs Retrieved Successfully!',
                "data": [
                    {
                        ...data
                    }
                ]
            }

```

### Endpoint 26:

- Method: GET
- Path: api/v1/blogs/659a62fc30bcd900689e2e54
- Description: we can get single blogs
- Example:

```curl
    Curl  api/v1/blogs/659a62fc30bcd900689e2e54

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'Single Blog Retrieved Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

### Endpoint 28:

- Method: PATCH
- Path: api/v1/blogs/659a62fc30bcd900689e2e54
- Description: we can update single Blog
- Example:

```curl
    Curl  api/v1/blogs/659a62fc30bcd900689e2e54

    Body:
        {
            "title": "...",
            ... if we want
        }

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'Blog Updated Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

### Endpoint 29:

- Method: DELETE
- Path: api/v1/blogs/659a62fc30bcd900689e2e54
- Description: we can delete single blog
- Example:

```curl
    Curl  api/v1/blogs/659a62fc30bcd900689e2e54

    Response:
            {
                "statusCode": 200,
                "success": true,
                "message": 'Blog Removed Successfully!',
                "data":
                    {
                        ...data
                    }

            }

```

## Dependencies

- **bcrypt**: used for hashing passwords.
- **cookie-parser**: cookie-parser middleware, which parses cookies.
- **jsonwebtoken**: jsonwebtoken library, used for JWT generation and verification.
- **node**: Node.js core modules and global objects.
- **aws-sdk**: Official AWS SDK for JavaScript, providing interfaces for AWS services.
- **axios**: Promise-based HTTP client for making HTTP requests.
- **bcrypt**: Library for hashing passwords with bcrypt encryption.
- **cookie-parser**: Middleware for parsing cookies in Express.js applications.
- **cors**: Middleware for enabling Cross-Origin Resource Sharing (CORS).
- **dotenv**: Loads environment variables from a `.env` file into `process.env`.
- **express**: Fast, minimalist web framework for Node.js.
- **http-status**: Utility for interacting with HTTP status codes.
- **jsonwebtoken**: Library for generating and verifying JSON Web Tokens (JWTs).
- **mongoose**: MongoDB object modeling tool for Node.js.
- **multer**: Middleware for handling multipart/form-data, primarily for file uploads.
- **nodemailer**: Module for sending emails from Node.js applications.
- **stripe**: Official Stripe SDK for JavaScript, used for integrating Stripe payment functionality.
- **swagger-ui-dist**: Standalone distribution of Swagger UI for visualizing OpenAPI specifications.
- **swagger-ui-express**: Middleware to serve Swagger UI for Express.js applications.
- **validator**: Library for data validation and sanitization.
- **winston**: Logging library for Node.js applications.
- **winston-daily-rotate-file**: Transport for rotating log files daily.
- **yamljs**: YAML parser and serializer.
- **zod**: TypeScript-first schema declaration and validation library.

## Contributing

[Muhammad Jhohirul Islam Shohag](https://github.com/MuhammadShohagIslam)

## License

MIT License.
