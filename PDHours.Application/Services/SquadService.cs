using PDHours.Application.Interfaces.IRepositories;
using PDHours.Application.Interfaces.IServices;
using PDHours.Application.Services.Base;
using PDHours.Domain.Models;

namespace PDHours.Application.Services
{
    public class SquadService : BaseService<SquadModel>, ISquadService
    {

        private readonly ISquadRepository _repository;

        public SquadService(ISquadRepository repository) : base(repository)
        {
            _repository = repository;
        }
    }
}
