# API Reference - ESCOMBOT

## Base URL
```
http://localhost:3000/api
```

---

## 🔐 POST /login

Autenticar usuario y crear sesión.

### Request
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Response (200 OK)
```json
{
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "firstName": "Usuario",
    "lastName": "Prueba",
    "username": "testuser"
  }
}
```

**Headers:**
- `Set-Cookie: userId=<uuid>; HttpOnly; Path=/; Max-Age=604800`

### Error (401 Unauthorized)
```json
{
  "error": "Usuario no encontrado"
}
```

o

```json
{
  "error": "Contraseña incorrecta"
}
```

---

## 💬 GET /chats

Obtener lista de chats del usuario autenticado.

### Request
```
GET /api/chats
Headers:
  Cookie: userId=<uuid>
```

### Response (200 OK)
```json
{
  "chats": [
    {
      "id": "uuid",
      "title": "¿Cómo inscribirse?",
      "createdAt": "2024-01-04T10:30:00Z",
      "updatedAt": "2024-01-04T10:30:00Z"
    },
    {
      "id": "uuid",
      "title": "Información de constancias",
      "createdAt": "2024-01-03T15:45:00Z",
      "updatedAt": "2024-01-03T15:45:00Z"
    }
  ]
}
```

### Error (401 Unauthorized)
```json
{
  "error": "No autenticado"
}
```

---

## ✨ POST /chats

Crear nuevo chat.

### Request
```json
{
  "title": "Mi primera pregunta"
}
```

**Headers:**
- `Cookie: userId=<uuid>`
- `Content-Type: application/json`

### Response (201 Created)
```json
{
  "chat": {
    "id": "uuid",
    "title": "Mi primera pregunta",
    "createdAt": "2024-01-04T10:35:00Z",
    "updatedAt": "2024-01-04T10:35:00Z"
  }
}
```

### Error (401 Unauthorized)
```json
{
  "error": "No autenticado"
}
```

### Error (400 Bad Request)
```json
{
  "error": "El título es requerido"
}
```

---

## 📨 GET /chats/:id/messages

Obtener mensajes de un chat específico.

### Request
```
GET /api/chats/550e8400-e29b-41d4-a716-446655440000/messages
Headers:
  Cookie: userId=<uuid>
```

### Response (200 OK)
```json
{
  "messages": [
    {
      "id": "uuid",
      "role": "bot",
      "content": "¡Hola! Soy ESCOMBOT. ¿Qué necesitas saber?",
      "timestamp": "2024-01-04T10:30:00.000Z",
      "chatId": "uuid",
      "createdAt": "2024-01-04T10:30:00Z"
    },
    {
      "id": "uuid",
      "role": "user",
      "content": "¿Cómo me inscribo?",
      "timestamp": "2024-01-04T10:31:00.000Z",
      "chatId": "uuid",
      "createdAt": "2024-01-04T10:31:00Z"
    },
    {
      "id": "uuid",
      "role": "bot",
      "content": "Para inscribirse en ESCOM...",
      "timestamp": "2024-01-04T10:31:30.000Z",
      "chatId": "uuid",
      "createdAt": "2024-01-04T10:31:30Z"
    }
  ]
}
```

### Error (401 Unauthorized)
```json
{
  "error": "No autenticado"
}
```

### Error (404 Not Found)
```json
{
  "error": "Chat no encontrado"
}
```

---

## 💌 POST /messages

Enviar mensaje y obtener respuesta del bot.

### Request
```json
{
  "chatId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "¿Cuál es el procedimiento para obtener una constancia?"
}
```

**Headers:**
- `Cookie: userId=<uuid>`
- `Content-Type: application/json`

### Response (201 Created)
```json
{
  "userMessage": {
    "id": "uuid",
    "chatId": "uuid",
    "role": "user",
    "content": "¿Cuál es el procedimiento para obtener una constancia?",
    "timestamp": "2024-01-04T10:32:00.000Z"
  },
  "botMessage": {
    "id": "uuid",
    "chatId": "uuid",
    "role": "bot",
    "content": "Para obtener una constancia en ESCOM, debes seguir los siguientes pasos:\n\n1. Acceder al portal de servicios escolares\n2. Seleccionar la opción de constancias\n3. Llenar el formulario de solicitud\n4. Pagar la cuota correspondiente\n5. Recoger tu constancia en 2-3 días hábiles",
    "timestamp": "2024-01-04T10:32:15.000Z"
  }
}
```

### Error (401 Unauthorized)
```json
{
  "error": "No autenticado"
}
```

### Error (404 Not Found)
```json
{
  "error": "Chat no encontrado"
}
```

### Error (400 Bad Request)
```json
{
  "error": "chatId y message son requeridos"
}
```

### Error (500 Internal Server Error)
```json
{
  "error": "Error al crear mensaje"
}
```

---

## 🔄 Mapeo de Roles

La API mapea automáticamente los roles entre frontend y BD:

| Frontend | BD       | Notas               |
|----------|----------|---------------------|
| `bot`    | `assistant` | Mensajes del bot    |
| `user`   | `user`      | Mensajes del usuario|

### Ejemplo:
```json
// BD contiene:
{ "role": "assistant", "content": "..." }

// API retorna:
{ "role": "bot", "content": "..." }
```

---

## 🔐 Autenticación

Todas las rutas excepto `/login` requieren autenticación.

### Cómo autenticarse:
1. Enviar credenciales a `POST /login`
2. Servidor crea cookie `userId` (httpOnly)
3. Navegador envía automáticamente la cookie en siguientes requests

**No necesitas agregar headers manuales**, las cookies se envían automáticamente.

---

## ⏱️ Límites de tasa (Recomendado para producción)

```
- Login: 5 intentos por 15 minutos por IP
- Messages: 30 por minuto por usuario
- Chats: 100 por día por usuario
```

---

## 📝 Notas importantes

- Todos los endpoints retornan `Content-Type: application/json`
- Los timestamps están en formato ISO 8601
- Los IDs son UUIDs (v4)
- Las contraseñas nunca se retornan
- Las cookies de sesión son httpOnly y secure en producción

---

## 🧪 Ejemplos con cURL

### Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

### Obtener chats
```bash
curl http://localhost:3000/api/chats \
  -b cookies.txt
```

### Crear chat
```bash
curl -X POST http://localhost:3000/api/chats \
  -H "Content-Type: application/json" \
  -d '{"title":"Nueva conversación"}' \
  -b cookies.txt
```

### Enviar mensaje
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"chatId":"<uuid>","message":"¿Cómo puedo ayudarte?"}' \
  -b cookies.txt
```

### Obtener mensajes
```bash
curl http://localhost:3000/api/chats/<uuid>/messages \
  -b cookies.txt
```

---

## 🛠️ Ejemplos con JavaScript/Fetch

### Login
```javascript
const response = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'test@example.com', 
    password: 'password123' 
  })
});
const data = await response.json();
// Cookie userId se guarda automáticamente
```

### Obtener chats
```javascript
const response = await fetch('/api/chats');
const data = await response.json();
console.log(data.chats);
```

### Enviar mensaje
```javascript
const response = await fetch('/api/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chatId: 'uuid-del-chat',
    message: 'Hola, ¿cómo estás?'
  })
});
const data = await response.json();
console.log(data.botMessage);
```

---

**Última actualización:** Enero 2024
