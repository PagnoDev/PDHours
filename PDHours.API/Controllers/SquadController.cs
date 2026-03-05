using Microsoft.AspNetCore.Mvc;
using PDHours.Application.Interfaces.IServices;
using PDHours.Domain.Models;

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

        /// <summary>
        /// Retorna a lista de todas as squads cadastradas. Cada squad deve conter seu nome e a lista de membros que fazem parte dela.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _service.GetAll());
        }

        /// <summary>
        /// Adicionar uma nova squad. O nome da squad deve ser único, ou seja, não pode existir outra squad com o mesmo nome.
        /// </summary>
        /// <param name="name">Nome da nova squad</param>
        /// <returns>Retorna o status da operação</returns>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] string name)
        {
            SquadModel sm = new()
            {
                Name = name
            };

            _service.Add(sm);

            return Created();
        }

        /*
         * 4. Criar uma rota que retorne as horas gastas de cada membro de uma determinada squad em um determinado período (Parâmetros: squadId e período - pode considerar dias corridos).
         * 5. Criar uma rota que retorne o tempo total gasto de uma squad em um determinado período, ou seja, a quantidade total de horas realizadas pelos membros daquela squad 
         * (Parâmetros: squadId e período - pode considerar dias corridos).
         * 6. Criar uma rota que retorne a média gasta de hora por dia de uma squad em um determinado período. 
         * (Parâmetros: squadId e período - pode considerar dias corridos).
         */
    }
}
