namespace Application.Abstractions.Data;

using Microsoft.EntityFrameworkCore;
using CarShow.Domain.Entities;

public interface IAppDbContext
{
    // Registration table
    DbSet<Registration> Registrations { get; }



    // Add a DbSet<TEntity> property for each entity in Domain/Entities
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
