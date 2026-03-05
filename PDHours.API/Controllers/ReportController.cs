using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PDHours.Application.Interfaces.IServices;

namespace PDHours.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _service;

        public ReportController(IReportService service)
        {
            _service = service;
        }
    }
}
