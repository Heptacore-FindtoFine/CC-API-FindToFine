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
-- Using CREATE (With form-date)
   ![image](https://github.com/Heptacore-FindtoFine/CC-API-FindToFine/assets/115993875/7d1a427b-402d-46e3-9de0-2c01d6248c9a)
-- Using POST (With RAW) (Still need update)
```
{
    "title": "Liburan Ke Jember",
    "startDate": "2024-06-04",
    "finishDate": "2024-06-06",
    "location": "Jember",
    "description": "Liburan yang sangat mengasyikkan",
    "items": ["Baju", "Celana"]
}
```
#### Note: make sure to change the generated task `id` from the previously created task `id`. Just in case if using it for `GET('task/id')`, `POST('/task/id')`, and `DELETE('/task/id')`.
