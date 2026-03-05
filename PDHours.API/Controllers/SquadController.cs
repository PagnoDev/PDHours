using Microsoft.AspNetCore.Mvc;
using PDHours.Application.Interfaces.IServices;

namespace PDHours.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SquadController : ControllerBase
    {
        private readonly ISquadService _service;

        public SquadController(ISquadService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_service.GetAll());
        }
    }
}
