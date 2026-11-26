using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using CarShow.Domain.Enums;
using Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Registrations.GetRegistrationSummary;

public sealed class GetRegistrationSummaryHandler
    : IQueryHandler<GetRegistrationSummaryQuery,
        Result<GetRegistrationSummaryResponse>>
{
    private readonly IAppDbContext _context;

    public GetRegistrationSummaryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<GetRegistrationSummaryResponse>> HandleAsync(
        GetRegistrationSummaryQuery query,
        CancellationToken cancellationToken = default)
    {
        // Retrieve the data needed for the summary
        var registrations = await _context.Registrations
            .AsNoTracking()
            .Select(r => new
            {
                r.Status,
                r.RegistrationFee,
                r.AmountPaid
            })
            .ToListAsync(cancellationToken);

        // Count all registrations
        int totalRegistrations = registrations.Count;

        // Count registrations by status
        int confirmed = registrations.Count(r =>
            r.Status == RegistrationStatus.Confirmed);

        int checkedIn = registrations.Count(r =>
            r.Status == RegistrationStatus.CheckedIn);

        int pending = registrations.Count(r =>
            r.Status == RegistrationStatus.Pending);

        int cancelled = registrations.Count(r =>
            r.Status == RegistrationStatus.Cancelled);

        // Exclude cancelled registrations from financial totals
        var activeRegistrations = registrations
            .Where(r => r.Status != RegistrationStatus.Cancelled)
            .ToList();

        // Calculate total registration fees
        decimal totalFees = activeRegistrations
            .Sum(r => r.RegistrationFee);

        // Calculate total payments
        decimal totalPayments = activeRegistrations
            .Sum(r => r.AmountPaid);

        // Calculate remaining unpaid balance
        decimal uncollectedPayments = totalFees - totalPayments;

        // Prepare the summary response
        var response = new GetRegistrationSummaryResponse(
            totalRegistrations,
            confirmed,
            checkedIn,
            pending,
            cancelled,
            totalFees,
            totalPayments,
            uncollectedPayments
        );

        // Return the successful result
        return Result<GetRegistrationSummaryResponse>.Success(response);
    }
}
