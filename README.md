# API for Task and User Models

## Getting Started:
### Step 1 : Download all dependencies
```
npm install
```
### Step 2 : Run the server
```
# for production
npm run start

# or for development
npm run start:dev
```
### Step 3 : Test API with Postman
1. Export file `Task API Test.postman_collection.json` on Postman
2. Test the API with body example
```
{
    "title": "Liburan Ke Bali",
    "location": "Bali",
    "description": "Liburan yang sangat mengasyikkan",
    "item": ["Baju", "Celana"]
}
```
#### Note: make sure to change the generated task `id` from the previously created task `id`. Just in case if using it for `GET('task/id')`, `POST('/task/id')`, and `DELETE('/task/id')`.
