using PDHours.Application.Interfaces.IRepositories;
using PDHours.Application.Interfaces.IServices;
using PDHours.Application.Services.Base;
using PDHours.Domain.Models;

namespace PDHours.Application.Services
{
    public class ReportService : BaseService<ReportModel>, IReportService
    {
        private readonly IReportRepository _repository;

        public ReportService(IReportRepository repository) : base(repository)
        {
            _repository = repository;
        }
    }
}
