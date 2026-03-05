using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PDHours.Application.Interfaces.IServices;

namespace PDHours.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _service;

        public EmployeeController(IEmployeeService service)
        {
            _service = service;
        }
    }
}
