# Chat API Documentation

## Overview

The Chat API is a RESTful API that allows developers to interact with chat data. It provides endpoints for creating, retrieving, and updating chat data.

## Endpoints

### GET /chats/:id

Retrieves a chat by its ID.

**Parameters:**

- `id`: The ID of the chat.

**Response:**

- `200 OK`: Returns the chat data.
- `404 Not Found`: No chat with the provided ID was found.

**Example Request:**

```http
GET http://localhost:3000/chats/6654d84926cfb6b2895ae9a6
```

### POST /chats

Creates a new chat between a Landlord and a Tenant.
Saves the chat to the database and returns the created chat data.
Will trigger the receivers Socket Room with 'chatCreated' header if existing for pushing realtime updates.

**Request Body:**

- `Landlord`: The ID of the Landlord.
- `Tenant`: The ID of the Tenant.

**Response:**

- `201 Created`: Returns the created chat data.
- `400 Bad Request`: Missing Landlord or Tenant, or invalid Landlord or Tenant ID.
- `500 Internal Server Error`: An error occurred while saving the chat.

### GET /chats/Landlord/:id

Retrieves all chats where the provided ID is the Landlord.

**Parameters:**

- `id`: The ID of the Landlord.

**Response:**

- `200 OK`: Returns the chat data.
- `404 Not Found`: No chat with the provided Landlord ID was found.

### GET /chats/Tenant/:id

Retrieves all chats where the provided ID is the Tenant.

**Parameters:**

- `id`: The ID of the Tenant.

**Response:**

- `200 OK`: Returns the chat data.
- `404 Not Found`: No chat with the provided Tenant ID was found.

### POST /chats/:chat_id

Adds a message to a chat. And will trigger the receivers Socket Room with 'chatUpdated' header if existing for pushing realtime updates.
**Parameters:**

- `chat_id`: The ID of the chat.

**Request Body:**

- `content`: The content of the message.
- `sender`: The sender of the message. Must be either "Landlord" or "Tenant".

**Response:**

- `200 OK`: Returns the updated chat data.
- `400 Bad Request`: Missing content or sender, invalid sender, invalid content, invalid chat ID, or chat is not active.
- `404 Not Found`: No chat with the provided chat ID was found.
- `500 Internal Server Error`: An error occurred while saving the message.

### GET /chats/:user_type/:user_id/unread

Retrieves the number of unread messages for a user.

**Parameters:**

- `user_type`: The type of user. Must be either "Landlord" or "Tenant".
- `user_id`: The ID of the user.

**Response:**

- `200 OK`: Returns the number of unread messages.
- `400 Bad Request`: Invalid user type or invalid user ID.
- `404 Not Found`: No user with the provided user ID was found.
- `500 Internal Server Error`: An error occurred while retrieving the unread messages.

### POST /chats/:chat_id/:user_type/read

Marks all recent messages in a chat as read for the provided user type.

**Parameters:**

- `chat_id`: The ID of the chat.
- `user_type`: The type of user. Must be either "Landlord" or "Tenant".

**Response:**

- `200 OK`: Returns the updated chat data.
- `400 Bad Request`: Invalid user type, invalid chat ID, or chat is not active.
- `404 Not Found`: No chat with the provided chat ID was found.
- `500 Internal Server Error`: An error occurred while saving the read status.


### POST /chats/:chat_id/archive

Marks a chat as inactive

**Parameters:**

- `chat_id`: The ID of the chat.

**Response:**

- `200 OK`: Returns the updated chat data.
- `400 Bad Request`: Invalid chat ID.
- `404 Not Found`: No chat with the provided chat ID was found.
- `500 Internal Server Error`: An error occurred while archiving the chat.

### POST /:searchProfileId/:flatProfileId/archive

Marks a all chats between those two profiles as inactive

**Parameters:**

- `searchProfileId`: The ID of the search profile.
- `flatProfileId`: The ID of the flat profile.

**Response:**

- `200 OK`: Returns the updated chats data.
- `400 Bad Request`: Invalid search profile ID or flat profile ID.
- `404 Not Found`: No chat with the provided search profile ID and flat profile ID was found.
- `500 Internal Server Error`: An error occurred while archiving the chats.

## Web Socket for Chat
**Socket Event:**  
Posting a message to a chat will trigger a chatUpdated event on the WebSocket server. The receiver of the message, if 
subscribed to his channel will receive the updated chat data on the room 'user-<userId>'. The user only has to subscribe 
to his personal channel, not a channel for each chat he is in. The server will handle the rest. 
On disconnect the user will be removed from the room and the room and the room will be closed if no users are in it.

To subscribe to the chat room, the client should send a 'subscribeToChats' message including the userId in the payload.
The server will then subscribe the user to the room 'user-<userId>'.
The client can then listen to the 'chatUpdated' event to receive updates on his chats.

## Error Handling

Errors are returned as JSON in the following format:

```json
{
  "error": "Error Type",
  "message": "Error message"
}
```

## Examples

Refer to the `backend/api_demo/chat.http` file for example requests and responses.