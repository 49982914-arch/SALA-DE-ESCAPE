using System.Data;
using System.Data.SqlClient;
using Dapper;
using SALA_DE_ESCAPE.Models;

namespace SALA_DE_ESCAPE
{
    public class BD
    {
        private static string _connectionString = "";

        public static void Configurar(string connectionString)
        {
            _connectionString = connectionString;
        }

        // Crear Jugador
        public static int CrearJugador(string nombre)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var query = "INSERT INTO Jugador (nombre) VALUES (@nombre); SELECT CAST(SCOPE_IDENTITY() as int);";
                var id = connection.QueryFirstOrDefault<int>(query, new { nombre });
                return id;
            }
        }

        // Crear Partida
        public static int CrearPartida(int jugadorId, int salaActualId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var query = "INSERT INTO Partida (jugadorId, salaActualId) VALUES (@jugadorId, @salaActualId); SELECT CAST(SCOPE_IDENTITY() as int);";
                var id = connection.QueryFirstOrDefault<int>(query, new { jugadorId, salaActualId });
                return id;
            }
        }

        // Obtener Partida
        public static Partida ObtenerPartida(int partidaId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var query = "SELECT id, jugadorId, salaActualId FROM Partida WHERE id = @id";
                var partida = connection.QueryFirstOrDefault<Partida>(query, new { id = partidaId });
                return partida;
            }
        }

        // Actualizar Sala Actual
        public static void ActualizarSalaActual(int partidaId, int salaActualId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var query = "UPDATE Partida SET salaActualId = @salaActualId WHERE id = @id";
                connection.Execute(query, new { salaActualId, id = partidaId });
            }
        }

        // Guardar Respuesta
        public static void GuardarRespuesta(int partidaId, int salaId, int numeroIntento, string? respuesta, bool esCorrecto)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var query = "INSERT INTO Respuesta (partidaId, salaId, numeroIntento, respuestaIngresada, esCorrecto) VALUES (@partidaId, @salaId, @numeroIntento, @respuesta, @esCorrecto)";
                connection.Execute(query, new { partidaId, salaId, numeroIntento, respuesta, esCorrecto });
            }
        }

        // Obtener Última Respuesta
        public static Respuesta ObtenerUltimaRespuesta(int partidaId, int salaId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var query = "SELECT TOP 1 id, partidaId, salaId, numeroIntento, respuestaIngresada, esCorrecto FROM Respuesta WHERE partidaId = @partidaId AND salaId = @salaId ORDER BY numeroIntento DESC";
                var respuesta = connection.QueryFirstOrDefault<Respuesta>(query, new { partidaId, salaId });
                return respuesta;
            }
        }

        // Obtener Sala por Número
        public static Sala ObtenerSala(int numero)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var query = "SELECT id, numero, nombre, descripcion FROM Sala WHERE numero = @numero";
                var sala = connection.QueryFirstOrDefault<Sala>(query, new { numero });
                return sala;
            }
        }
    }
}
