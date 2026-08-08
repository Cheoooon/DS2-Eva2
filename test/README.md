# Plan de Pruebas

## Casos de Prueba

### 1. Acceso Anónimo
- **Test**: Intentar acceder a `/` sin sesión.
- **Resultado esperado**: Redirección a `/login`.

### 2. Login con Credenciales Erróneas
- **Test**: Ingresar email válido pero contraseña incorrecta.
- **Resultado esperado**: Permanecer en `/login` y mostrar mensaje "Credenciales inválidas o usuario no encontrado.".

### 3. Login con Credenciales Correctas (Admin)
- **Test**: Ingresar credenciales correctas de admin.
- **Resultado esperado**: Redirección a `/`.

### 4. Acceso a paneles según Rol
- **Test**: Acceder a `/admin` con rol `STAFF` o `CLIENT`.
- **Resultado esperado**: Redirección o denegación de acceso (lógica de middleware/UI).

### 5. Validación de Reserva (Solapamiento)
- **Test**: Crear una reserva que se solape con una existente.
- **Resultado esperado**: Error "Mesa no disponible en este horario.".
