using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Registrations.GetRegistrations;

public sealed class GetRegistrationsHandler
    : IQueryHandler<GetRegistrationsQuery,
        Result<GetRegistrationsResponse>>
{
    private readonly IAppDbContext _context;

    public GetRegistrationsHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<GetRegistrationsResponse>> HandleAsync(
        GetRegistrationsQuery query,
        CancellationToken cancellationToken = default)
    {
        // Retrieve registrations without tracking
        var registrations = _context.Registrations
            .AsNoTracking()
            .AsQueryable();

        // Filter by participant name (case-insensitive)
        if (!string.IsNullOrWhiteSpace(query.ParticipantName))
        {
            string participantName = query.ParticipantName
                .Trim()
                .ToLower();

            registrations = registrations.Where(r =>
                r.ParticipantName.ToLower().Contains(participantName));
        }

        // Filter by registration type
        if (query.Type.HasValue)
        {
            registrations = registrations.Where(r =>
                r.RegistrationType == query.Type.Value);
        }

        // Filter by registration status
        if (query.Status.HasValue)
        {
            registrations = registrations.Where(r =>
                r.Status == query.Status.Value);
        }

        // Count all matching registrations
        int totalCount = await registrations
            .CountAsync(cancellationToken);

        // Calculate the total number of pages
        int totalPages = (int)Math.Ceiling(
            (double)totalCount / query.PageSize);

        // Calculate how many records to skip
        long skip = (long)(query.Page - 1) * query.PageSize;

        // Return an empty list when the page is out of range
        if (skip >= totalCount)
        {
            return Result<GetRegistrationsResponse>.Success(
                new GetRegistrationsResponse(
                    Array.Empty<RegistrationItemResponse>(),
                    query.Page,
                    query.PageSize,
                    totalCount,
                    totalPages));
        }

        // Sort and retrieve the requested page
        var pagedRegistrations = await registrations
            .OrderByDescending(r => r.RegistrationDate)
            .ThenBy(r => r.Id)
            .Skip((int)skip)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        // Map registrations to response items
        var items = pagedRegistrations.Select(r =>
            new RegistrationItemResponse(
                r.Id,
                r.RegistrationNumber,
                DateTime.SpecifyKind(
                    r.RegistrationDate, DateTimeKind.Utc),
                r.ParticipantName,
                r.ContactNumber,
                r.Email,
                r.Address,
                r.CarMakeModel,
                r.PlateNumber,
                r.RegistrationType,
                r.Status,
                r.RegistrationFee,
                r.AmountPaid,
                r.GetPaymentStatus()
            )).ToList();

        // Prepare the paginated response
        var response = new GetRegistrationsResponse(
            items,
            query.Page,
            query.PageSize,
            totalCount,
            totalPages
        );

        return Result<GetRegistrationsResponse>.Success(response);
    }
}
