# Matching API Documentation

## Overview

The Matching API provides endpoints to manage and retrieve matching profiles between flat listings and tenant search profiles. It allows users to fetch promising matches, like or dislike profiles, and approve or disapprove tenants.

## Endpoints

### 1. Get Promising Flat Profiles for a Tenant

**Endpoint**: `/promising/flatProfiles/:searchProfileId`

**Method**: `GET`

**Description**: Retrieves a paginated list of the most promising flat profiles for a given search profile, excluding flats that have been liked or disliked by the tenant.

**Query Parameters**:
- `limit` (optional): Number of profiles to return per page (default: 10).
- `page` (optional): Page number to return (default: 0).

**Response**:
- `200 OK`: An array of promising flat profiles.
- `204 No Content`: No more profiles to return.
- `500 Internal Server Error`: Matching Service not initialized or other server error.

### 2. Get Promising Tenant Profiles for a Flat

**Endpoint**: `/promising/searchProfiles/:flatProfileId`

**Method**: `GET`

**Description**: Retrieves a paginated list of the most promising tenant profiles for a given flat profile, excluding tenants that have been disapproved and separating approved from not approved tenants.

**Query Parameters**:
- `limit` (optional): Number of profiles to return per page (default: 10).
- `page` (optional): Page number to return (default: 0).

**Response**:
- `200 OK`: An array of promising tenant profiles.
- `204 No Content`: No more profiles to return.
- `500 Internal Server Error`: Matching Service not initialized or other server error.

### 3. Like a Flat Profile

**Endpoint**: `/tenants/:searchProfileId/likes/:flatProfileId`

**Method**: `PUT`

**Description**: Marks a flat profile as liked by a tenant search profile.

**Response**:
- `200 OK`: Flat liked successfully.
- `400 Bad Request`: Invalid searchProfileId or flatProfileId.
- `500 Internal Server Error`: Failed to like flat.

### 4. Dislike a Flat Profile

**Endpoint**: `/tenants/:searchProfileId/dislikes/:flatProfileId`

**Method**: `PUT`

**Description**: Marks a flat profile as disliked by a tenant search profile.

**Response**:
- `200 OK`: Flat disliked successfully.
- `400 Bad Request`: Invalid searchProfileId or flatProfileId.
- `500 Internal Server Error`: Failed to dislike flat.

### 5. Approve a Tenant Profile

**Endpoint**: `/landlord/:flatProfileId/approvals/:searchProfileId`

**Method**: `PUT`

**Description**: Approves a tenant profile for a flat profile.

**Response**:
- `200 OK`: Tenant approved successfully.
- `400 Bad Request`: Invalid flatProfileId or searchProfileId.
- `500 Internal Server Error`: Failed to approve tenant.

### 6. Disapprove a Tenant Profile

**Endpoint**: `/landlord/:flatProfileId/disapprovals/:searchProfileId`

**Method**: `PUT`

**Description**: Disapproves a tenant profile for a flat profile.

**Response**:
- `200 OK`: Tenant disapproved successfully.
- `400 Bad Request`: Invalid flatProfileId or searchProfileId.
- `500 Internal Server Error`: Failed to disapprove tenant.

### 7. Get Approved Tenants for a Flat

**Endpoint**: `/landlord/:flatProfileId/approvals`

**Method**: `GET`

**Description**: Retrieves the list of approved tenants for a given flat profile.

**Response**:
- `200 OK`: An array of approved tenant profiles.
- `404 Not Found`: Flat Profile not found.

### 8. Add or Update a Profile in Matching Service
**Should not be necessary, as the matching controller is listening for the profiles to be added to the database.**

**Endpoint**: `/addProfile/:profile_type/:profile_id`

**Method**: `POST`

**Description**: Adds or updates a flat or search profile in the matching service.

**Parameters**:
- `profile_type`: Type of profile to add or update (`flatProfile` or `searchProfile`).
- `profile_id`: ID of the profile to add or update.

**Response**:
- `200 OK`: Profile added or updated successfully.
- `400 Bad Request`: Invalid profile_id or profile_type.
- `500 Internal Server Error`: Failed to add profile to matching service.

---

## MatchingController Methods

### 1. `initialize()`

**Description**: Initializes the MatchingService by loading flat and search profiles from the database and populating the tags.

### 2. `getPromisingFlats(req: Request, res: Response)`

**Description**: Retrieves the most promising flat profiles for a given search profile.

### 3. `getPromisingTenants(req: Request, res: Response)`

**Description**: Retrieves the most promising tenant profiles for a given flat profile.

### 4. `getApprovedTenants(req: Request, res: Response)`

**Description**: Retrieves the approved tenant profiles for a given flat profile.

### 5. `likeFlat(req: Request, res: Response)`

**Description**: Marks a flat profile as liked by a tenant search profile.

### 6. `dislikeFlat(req: Request, res: Response)`

**Description**: Marks a flat profile as disliked by a tenant search profile.

### 7. `approveTenant(req: Request, res: Response)`

**Description**: Approves a tenant profile for a flat profile.

### 8. `disapproveTenant(req: Request, res: Response)`

**Description**: Disapproves a tenant profile for a flat profile.

### 9. `addProfile(req: Request, res: Response)`

**Description**: Adds or updates a flat or search profile in the matching service.
