using PDHours.Domain.Models;

namespace PDHours.Application.Interfaces.IServices.Base
{
    public interface IBaseService<T>
    {
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
        T? GetById(int id);
        IQueryable<T> GetAll();
    }
}
