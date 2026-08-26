using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using SALA_DE_ESCAPE.Models;

namespace SALA_DE_ESCAPE.Controllers;

public class HomeController : Controller
{
    // Respuestas correctas para cada sala
    private static readonly Dictionary<int, string> RespuestasCorrectas = new()
    {
        { 1, "storm" },
        { 2, "fortnite" },
        { 3, "loot" },
        { 4, "victory" }
    };

    // Index GET - Mostrar pantalla de inicio
    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }

    // Index POST - Crear jugador y partida
    [HttpPost]
    public IActionResult Index(string nombreParticipante)
    {
        if (string.IsNullOrWhiteSpace(nombreParticipante))
        {
            ViewBag.Error = "Ingresa tu nombre para comenzar";
            return View();
        }

        // Crear jugador
        int jugadorId = BD.CrearJugador(nombreParticipante);

        // Crear partida en sala 1
        int partidaId = BD.CrearPartida(jugadorId, 1);

        // Guardar en sesión
        HttpContext.Session.SetString("NombreParticipante", nombreParticipante);
        HttpContext.Session.SetInt32("PartidaId", partidaId);
        HttpContext.Session.SetInt32("SalaActual", 1);

        return RedirectToAction("Sala1");
    }

    // Sala 1 GET
    [HttpGet]
    public IActionResult Sala1()
    {
        if (HttpContext.Session.GetString("NombreParticipante") == null)
            return RedirectToAction("Index");

        var salaActual = HttpContext.Session.GetInt32("SalaActual") ?? 0;
        if (salaActual != 1)
            return RedirectToAction($"Sala{salaActual}");

        var sala = BD.ObtenerSala(1);
        ViewBag.Sala = sala;
        ViewBag.NombreParticipante = HttpContext.Session.GetString("NombreParticipante");

        var partidaId = HttpContext.Session.GetInt32("PartidaId") ?? 0;
        var ultimaRespuesta = BD.ObtenerUltimaRespuesta(partidaId, 1);
        if (ultimaRespuesta != null && ultimaRespuesta.EsCorrecto)
            return RedirectToAction("Sala2");

        return View();
    }

    // Sala 1 POST
    [HttpPost]
    public IActionResult Sala1(string respuesta)
    {
        var partidaId = HttpContext.Session.GetInt32("PartidaId") ?? 0;
        var esCorrecto = respuesta?.ToLower().Trim() == RespuestasCorrectas[1];

        // Obtener último intento
        var ultimaRespuesta = BD.ObtenerUltimaRespuesta(partidaId, 1);
        int numeroIntento = (ultimaRespuesta?.NumeroIntento ?? 0) + 1;

        // Guardar respuesta
        BD.GuardarRespuesta(partidaId, 1, numeroIntento, respuesta ?? "", esCorrecto);

        if (esCorrecto)
        {
            BD.ActualizarSalaActual(partidaId, 2);
            HttpContext.Session.SetInt32("SalaActual", 2);
            return RedirectToAction("Sala2");
        }

        ViewBag.Error = "Respuesta incorrecta. Intenta nuevamente.";
        ViewBag.Intentos = numeroIntento;
        return Sala1();
    }

    // Sala 2 GET
    [HttpGet]
    public IActionResult Sala2()
    {
        if (HttpContext.Session.GetString("NombreParticipante") == null)
            return RedirectToAction("Index");

        var salaActual = HttpContext.Session.GetInt32("SalaActual") ?? 0;
        if (salaActual < 2)
            return RedirectToAction("Sala1");

        var sala = BD.ObtenerSala(2);
        ViewBag.Sala = sala;
        ViewBag.NombreParticipante = HttpContext.Session.GetString("NombreParticipante");

        var partidaId = HttpContext.Session.GetInt32("PartidaId") ?? 0;
        var ultimaRespuesta = BD.ObtenerUltimaRespuesta(partidaId, 2);
        if (ultimaRespuesta != null && ultimaRespuesta.EsCorrecto)
            return RedirectToAction("Sala3");

        return View();
    }

    // Sala 2 POST
    [HttpPost]
    public IActionResult Sala2(string respuesta)
    {
        var partidaId = HttpContext.Session.GetInt32("PartidaId") ?? 0;
        var esCorrecto = respuesta?.ToLower().Trim() == RespuestasCorrectas[2];

        var ultimaRespuesta = BD.ObtenerUltimaRespuesta(partidaId, 2);
        int numeroIntento = (ultimaRespuesta?.NumeroIntento ?? 0) + 1;

        BD.GuardarRespuesta(partidaId, 2, numeroIntento, respuesta ?? "", esCorrecto);

        if (esCorrecto)
        {
            BD.ActualizarSalaActual(partidaId, 3);
            HttpContext.Session.SetInt32("SalaActual", 3);
            return RedirectToAction("Sala3");
        }

        ViewBag.Error = "Respuesta incorrecta. Intenta nuevamente.";
        ViewBag.Intentos = numeroIntento;
        return Sala2();
    }

    // Sala 3 GET
    [HttpGet]
    public IActionResult Sala3()
    {
        if (HttpContext.Session.GetString("NombreParticipante") == null)
            return RedirectToAction("Index");

        var salaActual = HttpContext.Session.GetInt32("SalaActual") ?? 0;
        if (salaActual < 3)
            return RedirectToAction("Sala2");

        var sala = BD.ObtenerSala(3);
        ViewBag.Sala = sala;
        ViewBag.NombreParticipante = HttpContext.Session.GetString("NombreParticipante");

        var partidaId = HttpContext.Session.GetInt32("PartidaId") ?? 0;
        var ultimaRespuesta = BD.ObtenerUltimaRespuesta(partidaId, 3);
        if (ultimaRespuesta != null && ultimaRespuesta.EsCorrecto)
            return RedirectToAction("Sala4");

        return View();
    }

    // Sala 3 POST
    [HttpPost]
    public IActionResult Sala3(string respuesta)
    {
        var partidaId = HttpContext.Session.GetInt32("PartidaId") ?? 0;
        var esCorrecto = respuesta?.ToLower().Trim() == RespuestasCorrectas[3];

        var ultimaRespuesta = BD.ObtenerUltimaRespuesta(partidaId, 3);
        int numeroIntento = (ultimaRespuesta?.NumeroIntento ?? 0) + 1;

        BD.GuardarRespuesta(partidaId, 3, numeroIntento, respuesta ?? "", esCorrecto);

        if (esCorrecto)
        {
            BD.ActualizarSalaActual(partidaId, 4);
            HttpContext.Session.SetInt32("SalaActual", 4);
            return RedirectToAction("Sala4");
        }

        ViewBag.Error = "Respuesta incorrecta. Intenta nuevamente.";
        ViewBag.Intentos = numeroIntento;
        return Sala3();
    }

    // Sala 4 GET
    [HttpGet]
    public IActionResult Sala4()
    {
        if (HttpContext.Session.GetString("NombreParticipante") == null)
            return RedirectToAction("Index");

        var salaActual = HttpContext.Session.GetInt32("SalaActual") ?? 0;
        if (salaActual < 4)
            return RedirectToAction("Sala3");

        var sala = BD.ObtenerSala(4);
        ViewBag.Sala = sala;
        ViewBag.NombreParticipante = HttpContext.Session.GetString("NombreParticipante");

        var partidaId = HttpContext.Session.GetInt32("PartidaId") ?? 0;
        var ultimaRespuesta = BD.ObtenerUltimaRespuesta(partidaId, 4);
        if (ultimaRespuesta != null && ultimaRespuesta.EsCorrecto)
            return RedirectToAction("Victoria");

        return View();
    }

    // Sala 4 POST
    [HttpPost]
    public IActionResult Sala4(string respuesta)
    {
        var partidaId = HttpContext.Session.GetInt32("PartidaId") ?? 0;
        var esCorrecto = respuesta?.ToLower().Trim() == RespuestasCorrectas[4];

        var ultimaRespuesta = BD.ObtenerUltimaRespuesta(partidaId, 4);
        int numeroIntento = (ultimaRespuesta?.NumeroIntento ?? 0) + 1;

        BD.GuardarRespuesta(partidaId, 4, numeroIntento, respuesta ?? "", esCorrecto);

        if (esCorrecto)
        {
            BD.ActualizarSalaActual(partidaId, 5);
            HttpContext.Session.SetInt32("SalaActual", 5);
            return RedirectToAction("Victoria");
        }

        ViewBag.Error = "Respuesta incorrecta. Intenta nuevamente.";
        ViewBag.Intentos = numeroIntento;
        return Sala4();
    }

    // Victoria GET
    [HttpGet]
    public IActionResult Victoria()
    {
        if (HttpContext.Session.GetString("NombreParticipante") == null)
            return RedirectToAction("Index");

        ViewBag.NombreParticipante = HttpContext.Session.GetString("NombreParticipante");
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
