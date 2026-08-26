namespace SALA_DE_ESCAPE.Models
{
    public class Respuesta
    {
        public int Id { get; set; }
        public int PartidaId { get; set; }
        public int SalaId { get; set; }
        public int NumeroIntento { get; set; }
        public string RespuestaIngresada { get; set; }
        public bool EsCorrecto { get; set; }
    }
}
