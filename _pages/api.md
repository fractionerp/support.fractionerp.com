---
title: "API Documentation"
description: "FractionERP REST API documentation. Authentication, endpoints, query parameters, and response formats for external integrations."
section: "API"
---

# API Documentation

## Overview

The FractionERP REST API provides access to your data for external integrations. All API requests require authentication using a Bearer token.

### Base URL

```
https://fraction.app/api/v1
```

### Rate Limiting

API requests are limited to **2,000 requests per hour** per user. Rate limit information is included in response headers:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests per hour |
| `X-RateLimit-Remaining` | Remaining requests in current window |
| `X-RateLimit-Reset` | Unix timestamp when the limit resets |

---

## Authentication

Authenticate using your existing FractionERP email and password to obtain an access token.

### 1. Login to Get Token

```
POST https://fraction.app/api/v1/auth/login
Content-Type: application/json
```

```json
{
    "email": "your.email@company.com",
    "password": "your_password"
}
```

**Response:**

```json
{
    "success": true,
    "data": {
        "token_type": "Bearer",
        "access_token": "eyJ0eXAiOiJKV1Q...",
        "expires_at": "2026-07-13T18:00:00+00:00",
        "user": { "id": 1, "name": "John Doe", "email": "john@company.com" },
        "tenant": { "id": 1, "company": "Company Ltd", "plan": "pro" }
    }
}
```

### 2. Use Token in Requests

Include the token in the `Authorization` header for all API requests:

```
GET https://fraction.app/api/v1/parts
Authorization: Bearer YOUR_ACCESS_TOKEN
Accept: application/json
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Login and get access token |
| POST | `/api/v1/auth/logout` | Revoke current token |
| GET | `/api/v1/auth/me` | Get current user info |
| POST | `/api/v1/auth/refresh` | Get a new token (revokes old) |

---

## Data Endpoints

All data endpoints require authentication. List endpoints return paginated results.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/customers` | List all customers |
| GET | `/api/v1/customers/{id}` | Get single customer with contacts |
| GET | `/api/v1/customers/{id}/contacts` | List contacts for a customer |
| POST | `/api/v1/customers/{id}/contacts` | Create a new contact for a customer |
| GET | `/api/v1/parts` | List all parts |
| GET | `/api/v1/parts/{id}` | Get single part |
| POST | `/api/v1/parts` | Create a new part (manufactured by default) |
| GET | `/api/v1/parts/{id}/price-lists` | Get customer price lists for a part |
| PUT | `/api/v1/parts/{id}/price-lists` | Create or replace customer price breaks for a part |
| GET | `/api/v1/contracts` | List all contracts/sales orders |
| GET | `/api/v1/contracts/{id}` | Get single contract |
| POST | `/api/v1/contracts` | Create a new enquiry |
| GET | `/api/v1/boms` | List all bills of materials |
| GET | `/api/v1/boms/{id}` | Get single BOM |
| GET | `/api/v1/work-orders` | List all work orders |
| GET | `/api/v1/work-orders/{id}` | Get single work order |
| GET | `/api/v1/purchase-orders` | List all purchase orders |
| GET | `/api/v1/purchase-orders/{id}` | Get single purchase order |
| GET | `/api/v1/shipments` | List all shipments |
| GET | `/api/v1/shipments/{id}` | Get single shipment |
| GET | `/api/v1/invoices` | List all invoices |
| GET | `/api/v1/invoices/{id}` | Get single invoice |

---

## Query Parameters

All list endpoints support the following query parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `page` | Page number (1-based) | `?page=2` |
| `per_page` | Items per page (max 100, default 25) | `?per_page=50` |
| `search` | Search term | `?search=widget` |
| `sort` | Sort field | `?sort=created_at` |
| `order` | Sort direction (asc/desc) | `?order=desc` |

---

## Response Format

All API responses follow this structure:

### Success Response

```json
{
    "success": true,
    "data": [ ... ],
    "meta": {
        "pagination": {
            "total": 100,
            "per_page": 25,
            "current_page": 1,
            "last_page": 4,
            "from": 1,
            "to": 25,
            "has_more": true
        }
    },
    "errors": null
}
```

### Error Response

```json
{
    "success": false,
    "data": null,
    "meta": null,
    "errors": [
        {
            "code": "UNAUTHORIZED",
            "message": "Invalid credentials."
        }
    ]
}
```

---

## Write Endpoints

### Create Customer Contact

Add a new contact to an existing customer.

```
POST /api/v1/customers/{id}/contacts
Content-Type: application/json
```

```json
{
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+44 123 456 7890",
    "job_title": "Purchasing Manager"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Contact name |
| `email` | No | Email address |
| `phone` | No | Phone number |
| `job_title` | No | Job title |

### Create Enquiry

Create a new enquiry for a customer. A quote number (Q-number) is auto-generated. You can pass either `customer_id` or `customer_name` to identify the customer.

```
POST /api/v1/contracts
Content-Type: application/json
```

```json
{
    "customer_name": "Acme Corp",
    "customer_contact_id": 42,
    "customer_ref": "PO-12345",
    "notes": "Urgent order"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `customer_name` | Yes (or `customer_id`) | Customer name |
| `customer_contact_id` | No | Contact ID |
| `customer_ref` | No | Customer reference |
| `notes` | No | Notes |

**Response (201):**

```json
{
    "success": true,
    "data": {
        "id": 653,
        "quote_number": "Q1235",
        "status": "Enquiry",
        "customer": { "id": 10, "name": "Acme Corp" },
        "customer_ref": "PO-12345",
        "currency": "GBP",
        "contract_date": "2026-03-25"
    }
}
```

### Create Part

Create a new part. Parts default to Manufactured type. Duplicate part numbers are rejected with a 409 error.

```
POST /api/v1/parts
Content-Type: application/json
```

```json
{
    "part_number": "WIDGET-001",
    "description": "Custom widget",
    "revision": "A",
    "uom": "EA",
    "material": "Stainless Steel",
    "category": "Machined Parts"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `part_number` | Yes | Must be unique |
| `description` | No | Part description |
| `revision` | No | Revision letter |
| `uom` | No | Unit of measure (default: EA) |
| `material` | No | Material type |
| `category` | No | Part category |

**Duplicate Response (409):**

```json
{
    "success": false,
    "errors": [{ "code": "DUPLICATE", "message": "A part with this part number already exists." }]
}
```

### Get Customer Price Lists for a Part

Returns all customer price lists associated with a part. Optionally filter by `customer_id`.

```
GET /api/v1/parts/{id}/price-lists
GET /api/v1/parts/{id}/price-lists?customer_id=52
```

**Response:**

```json
{
    "success": true,
    "data": [
        {
            "part_customer_id": 1,
            "customer_id": 52,
            "customer_name": "Acme Corp",
            "customer_part_number": "ACM-100",
            "selling_price": "10.50000",
            "price_breaks": [
                { "id": 1, "qty": 1, "price": 12.50 },
                { "id": 2, "qty": 100, "price": 10.00 },
                { "id": 3, "qty": 500, "price": 8.50 }
            ]
        }
    ]
}
```

### Update Customer Price List

Create or replace customer price breaks for a part. If the customer is not yet linked to the part, the link is created automatically. Existing price breaks are replaced entirely. Only base currency prices are supported.

```
PUT /api/v1/parts/{id}/price-lists
Content-Type: application/json
```

```json
{
    "customer_id": 52,
    "customer_part_number": "ACM-100",
    "selling_price": 10.50,
    "price_breaks": [
        { "qty": 1, "price": 12.50 },
        { "qty": 100, "price": 10.00 },
        { "qty": 500, "price": 8.50 }
    ]
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `customer_id` | Yes | Customer ID |
| `customer_part_number` | No | Customer's part number |
| `selling_price` | No | Base selling price |
| `price_breaks` | Yes | Array of qty/price pairs (min 1) |

Response returns the updated price list in the same format as the GET endpoint.

---

## Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 401 | `UNAUTHORIZED` | Missing or invalid authentication token |
| 401 | `INVALID_CREDENTIALS` | Wrong email or password |
| 403 | `FORBIDDEN` | Access denied |
| 403 | `PLAN_RESTRICTED` | API access requires Pro or Moulding plan |
| 403 | `ACCOUNT_INACTIVE` | Tenant account is inactive |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `DUPLICATE` | Resource already exists (e.g. duplicate part number) |
| 422 | `VALIDATION_ERROR` | Invalid input data (see errors array for field-level details) |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests, please wait |
| 500 | `SERVER_ERROR` | Internal server error |
