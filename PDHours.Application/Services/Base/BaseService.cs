using PDHours.Application.Interfaces.IRepositories.Base;
using PDHours.Application.Interfaces.IServices.Base;
using PDHours.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace PDHours.Application.Services.Base
{
    public abstract class BaseService<T> : IBaseService<T>
    {
        private readonly IRepository<T> _repository;

        public BaseService(IRepository<T> repository)
        {
            _repository = repository;
        }

        public void Add(T entity)
        {
            _repository.Add(entity);
        }

        public void Update(T entity)
        {
            _repository.Update(entity);
        }

        public void Delete(T entity)
        {
            _repository.Delete(entity);
        }

        public T? GetById(int id)
        {
            return _repository.GetById(id);
        }

        public IQueryable<T> GetAll()
        {
            return _repository.GetAll();
        }
    }
}
