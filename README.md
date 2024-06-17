# FindtoFine API for Bangkit Capstone Project

## Prequisete
- NodeJS

## Getting Started:
### Step 1 : Clone Repo
```
git clone https://github.com/Heptacore-FindtoFine/CC-API-FindToFine.git
```
### Step 2 : Download all dependencies
```
npm install
```
### Step 3 : Run the server
```
# for production
npm run start

# or for development
npm run start:dev
```

## API SPEC
### API URL
https://task-api-izoaerx5sa-et.a.run.app

### User API
### 1. Register User API
- Method: `POST`
- Endpoint: `/user/register`
- Request:
   - Body: 
      ```
      {
      "email": "example@gmail.com",
         "password": "example123"
      }
      ```
- Response Success:
   - Status Code: `201`
   - Body:
      ```
      {
         message: "Berhasil mendaftarkan akun"
      }
      ```
- Response Error:
   - Status Code: `500`
   - Body:
      ```
      {
         "message": "Gagal mendaftarkan akun"
      }
      ```

### 2. Login User API
- Method: `POST`
- Endpoint: `/user/register`
- Request:
   - Body: 
      ```
      {
         "email": "example@gmail.com",
         "password": "example123"
      }
      ```
- Response Success:
   - Status Code: `201`
   - Body:
      ```
      {
          "message": "Login berhasil",
          "data": {
              "uid": "user-id",
              "email": "example@gmail.com",
              "token": "user-token"
          }
      }
      ```
- Response Error: 
   - Status Code: `401`
   - Body:
      ```
      {
         "message": "Login gagal, periksa kembali Email atau Password"
      }
      ```

## Task API
### 1. CREATE Task API
- Method: `POST`
- Endpoint: `/task`
- Header:
  - Authorization: `Bearer user-token`
- Request:
   - Body:
      ```
      {
         "title": "string".
         "image": "multipart form-data",
         "startDate": "string (ISO 8601 date format)",
         "finishDate": "string (ISO 8601 date format)",
         "location": "string",
         "description": "string",
         "items": [
            {
               "image": "multipart form-data"
            }
         ],
      }
      ```
- Response Success:
   - Status Code: `201`
   - Body:
      ```
      {
            {
           "id": "string",
           "title": "string",
           "image": "string (URL)",
           "startDate": "string (ISO 8601 date format)",
           "finishDate": "string (ISO 8601 date format)",
           "location": "string",
           "description": "string",
           "items": [
             {
               "image": "string (URL)",
               "name": "string",
               "checked": "false"
             }
           ],
           "status": "false"
           "createdAt": "string (ISO 8601 date format)",
           "updatedAt": "string (ISO 8601 date format)"
            }
      }
      ```
- Response Error:
   - Status Code: `500`
   - Body:
      ```
      {
         "message": "Terjadi kesalahan saat membuat task"
      }
      ```

### 2. UPDATE Task API
- Method: `PUT`
- Endpoint: `/task/:id`
- Header: 
   - Authorization: `Bearer user-token`
- Request:
   - Body:
      ```
      {
        "title": "string",
        "startDate": "string (ISO 8601 date format)",
        "finishDate": "string (ISO 8601 date format)",
        "location": "string",
        "description": "string",
        "items": [
          {
            "name": "string"
          }
        ],
        "status": "boolean"
      }
      ```
- Response Success:
   - Status Code: `200`
   - Body:
      ```
      {
        "message": "Task updated successfully",
        "value": {
          "id": "string",
          "title": "string",
          "startDate": "string (ISO 8601 date format)",
          "finishDate": "string (ISO 8601 date format)",
          "location": "string",
          "description": "string",
          "status": "boolean",
          "updatedAt": "string (ISO 8601 date format)",
          "items": [
            {
              "image": "string",
              "name": "string",
              "checked": "boolean"
            }
          ]
        }
      }
      ```
- Response Error :
   - Status Code: `500`
   - Body: 
      ```
      {
         "message": "Terjadi kesalahan saat memperbarui task"
      }
      ```

### 3. UPDATE ItemStatus Task API
- Method: `PUT`
- Endpoint: `/task/:id/items`
- Header: 
   - Authorization: `Bearer user-token`
- Request:
   - Body:
      ```
      {
         "name": "string"
      }
      ```
- Response Success:
   - Status Code: `200`
   - Body: 
      ```
      {
        "id": "string",
        "title": "string",
        "image": "string (URL)",
        "startDate": "string (ISO 8601 date format)",
        "finishDate": "string (ISO 8601 date format)",
        "location": "string",
        "description": "string",
        "items": [
          {
            "image": "string (URL)",
            "name": "string",
            "checked": "boolean"
          }
        ],
        "status": "boolean",
        "createdAt": "string (ISO 8601 date format)",
        "updatedAt": "string (ISO 8601 date format)"
      }
      ```
- Response Error:
   - Status Code: `500`
   - Body:
      ```
      {
         "message": "Terjadi kesalahan saat mengubah status item"
      }
      ```

### 4. GET All Task API
- Method: `GET`
- Endpoint: `/task`
- Header: 
   - Authorization: `Bearer user-token`
- Response Success:
   - Body:
      ```
      [
        {
          "id": "string",
          "title": "string",
          "image": "string (URL)",
          "startDate": "string (ISO 8601 date format)",
          "finishDate": "string (ISO 8601 date format)",
          "location": "string",
          "items": "integer length",
          "status": "boolean",
          "createdAt": "string (ISO 8601 date format)",
          "updatedAt": "string (ISO 8601 date format)"
        }
     ]

      ```
- Response Error:
   - Body:
      ```
      {
         "message": "Terjadi kesalahan saat mengambil daftar task"
      }
      ```
      
### 5. GET Task by ID API
- Method: `GET`
- Endpoint: `/task/:id`
- Header: 
   - Authorization: `Bearer user-token`
- Response Success:
   - Body:
      ```
      {
        "id": "string",
        "title": "string",
        "image": "string (URL)",
        "startDate": "string (ISO 8601 date format)",
        "finishDate": "string (ISO 8601 date format)",
        "location": "string",
        "description": "string",
        "items": [
          {
            "image": "string (URL)",
            "name": "string",
            "checked": "boolean"
          }
        ],
        "status": "boolean",
        "createdAt": "string (ISO 8601 date format)",
        "updatedAt": "string (ISO 8601 date format)"
      }
      ```
- Response Error:
   - Body:
      ```   
      {
         "message": "Terjadi kesalahan saat mengambil detail task"
      }
      ```
  
### 6. DELETE Task API
- Method: `DELETE`
- Endpoint: `/task/:id`
- Header: 
   - Authorization: `Bearer user-token`
- Response Success:
   - Body:
      ```
      {
         "message": "Task berhasil dihapus"
      }
      ```
- Response Error:
   - Body:
      ```
      {
         "message": "Terjadi kesalahan saat menghapus task"
      }
      ```   
