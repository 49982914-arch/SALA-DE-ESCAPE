# Copilot Instructions - SALA DE ESCAPE

## Project Overview
**SALA DE ESCAPE** is an ASP.NET Core 9.0 MVC escape room game where players progress through 4 sequential puzzle rooms (Salas) by solving riddles.

## Architecture & Data Flow

### Core Game Flow
1. Player enters name at Index → creates `Jugador` record
2. System creates `Partida` (game session) for sala 1
3. Player answers puzzle → response saved to `Respuesta` table
4. Correct answer → `Partida.SalaActualId` updated, player redirected to next sala
5. Process repeats for salas 2-4 → Victory screen

### Data Access Layer (BD.cs)
- **Pattern:** Static class using **Dapper ORM** with direct SQL queries
- **Key Methods:**  
  - `CrearJugador/CrearPartida` → INSERT with SCOPE_IDENTITY
  - `ObtenerUltimaRespuesta` → Check if current room solved (TOP 1 ORDER BY NumeroIntento DESC)
  - `ActualizarSalaActual` → Progress player to next room
  - `GuardarRespuesta` → Each attempt recorded with `numeroIntento` counter

### Session Management
Uses ASP.NET Core session (30-min timeout) to track:
- `NombreParticipante` → player name
- `PartidaId` → current game session ID  
- `SalaActual` → current room number (1-4)

See [Program.cs](Program.cs) line 7 for session configuration.

## Controller Patterns

### Standard Room Action Pattern (Sala1-Sala4)
Each room implements **identical GET/POST pair**:

**GET Actions:**
```csharp
// 1. Validate session exists (redirect to Index if null)
// 2. Load Partida.SalaActualId from session
// 3. Check if already solved: ObtenerUltimaRespuesta(partidaId, salaId)
// 4. If solved.EsCorrecto = true → RedirectToAction($"Sala{next}")
// 5. Pass ultima respuesta attempts count to view via ViewBag.Intentos
```

**POST Actions:**
```csharp
// 1. Extract respuesta from form
// 2. Compare: respuesta.ToLower().Trim() == RespuestasCorrectas[salaId]
// 3. Get numeroIntento: (ultimaRespuesta?.NumeroIntento ?? 0) + 1
// 4. Save: BD.GuardarRespuesta(partidaId, salaId, numeroIntento, respuesta, esCorrecto)
// 5. If correct: BD.ActualizarSalaActual + update session + redirect to next sala
// 6. If wrong: return current view with ViewBag.Error message
```

**Answer Keys** stored in [HomeController.cs](Controllers/HomeController.cs#L12-L17):
- Sala 1: "aura" → Sala 2: "dorado" → Sala 3: "loot" → Sala 4: "victory"

### Validation Pattern
- Answers are **normalized** at comparison: `ToLower().Trim()`
- Always retrieve last attempt from DB to count tries
- Session-based state machine prevents skipping rooms (redirect to current `SalaActual`)

## Adding New Features

### New Room (e.g., Sala 5)
1. Add entry to `RespuestasCorrectas` dict in HomeController
2. Create `Sala5.cshtml` view in [Views/Home/](Views/Home/)
3. Implement GET/POST methods copying Sala4 pattern
4. Update Sala4 POST to redirect to "Sala5" instead of "Victoria"
5. Add answer to database via TormentaFinal.sql

### New Properties on Models
Due to Dapper usage, add properties to model class AND update all SQL queries in `BD.cs` that reference that model (search file for `SELECT *` patterns - none exist, all queries are explicit column lists).

## Database Configuration
- **Connection:** SQL Server via Integrated Security (Windows auth or local service account)
- **Connection String:** `Server=localhost;Database=TormentaFinal;Integrated Security=True;TrustServerCertificate=True;`
- **Configuration:** Embedded in [BD.cs](BD.cs#L10) as static field (no external configuration needed)
- **Schema Source:** [TormentaFinal.sql](TormentaFinal.sql)
- **Tables:** Jugador, Partida, Respuesta, Sala (all use int IDs)
- **ORM:** Dapper with `Microsoft.Data.SqlClient` (parameterized queries, no SQL injection risk)

## Build & Run
```powershell
dotnet run
# Or via VS Code: Ctrl+F5 launches debug server on https://localhost:5001
```

## Key Conventions
- **Namespace:** All code uses `SALA_DE_ESCAPE` or `SALA_DE_ESCAPE.Models/Controllers`
- **Answer validation:** Case-insensitive, whitespace-trimmed
- **Error UX:** Failed answer shows ViewBag.Error message, attempt count via ViewBag.Intentos
- **Navigation:** RedirectToAction always verifies session/state before showing content
- **SQL:** All queries use parameterized @parameters (no SQL injection risk)
