using PDHours.Application.Interfaces.IRepositories;
using PDHours.Domain.Models;
using PDHours.Infra.Data.Database.Context;
using PDHours.Infra.Data.Repositories.Base;

namespace PDHours.Infra.Data.Repositories
{
    public class SquadRepository : Repository<SquadModel>, ISquadRepository
    {
        public SquadRepository(DataContext db) : base(db) { }
    }
}
