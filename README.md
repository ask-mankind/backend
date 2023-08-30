# Modern Chat Forum - Ask Mankind  
Welcome to Ask Mankind, a modern chat forum where you can engage in conversations with others in real-time.
Live on ask-mankind.onrender.com

## Installation  
You can clone the project using the following command:
```
git clone https://github.com/ask-mankind/backend
```

## Running
In order to run the project, navigate to the project directory:
```
cd backend
```

Create an `.env` file in the root directory and add the following environment variables:
```
MONGO_URI=<your-mongo-uri>
JWT_SECRET_KEY=<your-jwt-secret-key>
PORT=5000
```

Install the required dependencies and start the development server:

```
npm install --include=dev
npm run swagger-autogen
npm run start
```

## Usage  
Once the development server is running, you can access the forum by opening your web browser and visiting:
http://localhost:5000

# Swagger
You can access the swagger page of the API at:
http://localhost:5000/doc

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)  
