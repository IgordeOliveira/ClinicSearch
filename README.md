# Clinic Search API 

RESTful API to allow search in multiple clinic providers and display results from all the available clinics by any of the following:

- Clinic Name
- State [ex: "CA" or "California"]
- Availability [ex: from:09:00, to:20:00]

I assumed that availability is the same as "is open", so I returned all open clinics based on the query parameters from and to, and both of them are required if you want to search by availability

Tools used: 
- Node + Express + Typescript as web framework
- Axios for requests mocking and HTTP Client
- Jest + supertest as testing framework
- PM2 as process manager for production docker server

## Documentation
```http
GET /api/v1/clinics/search
```
You must use at least one search param:
| Query | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | **Optional**. |
| `state` | `string` | **Optional**. |
| `from | to` | `string` | **Must be used together** Ex: "from=09:00&to=20:00" |

#### Responses
##### Success
Success response contains an array with all search results:

```javascript
{
  "data" : array,
}
```
##### Failed
Failed response contains an error field with a message code:

```javascript
{
  "error" : string,
}
```

#### Status Codes


| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |
| 400 | `BAD REQUEST`, `MUST_HAVE_FROM_AND_TO`, `NO_SEARCH_PARAMS` |

## How to run

Testing:

```sh
npm run test
``` 
Development:

```sh
npm run dev
``` 

Production:
```sh
docker-compose up
``` 
or
```sh
docker build -t searchapi .
docker run -dp 5000:5000 searchapi
``` 