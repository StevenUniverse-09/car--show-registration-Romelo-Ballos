using Api.Common.Extensions;
using Api.Common.Filters;
using Application.Abstractions.Messaging;
using Application.Features.Registrations.CreateRegistration;
using Domain.Common;
using Application.Features.Registrations.GetRegistrations;
using Application.Features.Registrations.GetRegistrationById;
using Application.Features.Registrations.GetRegistrationSummary;


namespace Api.Features.Registrations;

public static class RegistrationEndpoints
{
    public static void MapRegistrationEndpoints(
        this IEndpointRouteBuilder app)
    {
        // Create the registration route group
        var group = app.MapGroup("/api/registrations")
            .WithTags("Registrations");

        // POST: Create a new registration
        group.MapPost("", async (
            CreateRegistrationCommand command,
            ICommandHandler<CreateRegistrationCommand,
                Result<CreateRegistrationResponse>> handler,
            CancellationToken cancellationToken) =>
        {
            var result = await handler.HandleAsync(
                command,
                cancellationToken);

            if (!result.IsSuccess)
            {
                return result.ToProblemDetails();
            }

            return Results.Created(
                $"/api/registrations/{result.Value!.Id}",
                result.Value);
        })

        .AddEndpointFilter<ValidationFilter<CreateRegistrationCommand>>()
        .WithName("CreateRegistration")
        .Produces<CreateRegistrationResponse>(
            StatusCodes.Status201Created)
        .ProducesValidationProblem(
            StatusCodes.Status400BadRequest)
        .ProducesProblem(
            StatusCodes.Status409Conflict);



        // GET: Retrieve registrations with filtering and pagination
        group.MapGet("", async (
            [AsParameters] GetRegistrationsQuery query,
            IQueryHandler<GetRegistrationsQuery,
                Result<GetRegistrationsResponse>> handler,
            CancellationToken cancellationToken) =>
        {
            var result = await handler.HandleAsync(
                query,
                cancellationToken);

            if (!result.IsSuccess)
            {
                return result.ToProblemDetails();
            }

            return Results.Ok(result.Value);
        })
        .AddEndpointFilter<ValidationFilter<GetRegistrationsQuery>>()
        .WithName("GetRegistrations")
        .Produces<GetRegistrationsResponse>(
            StatusCodes.Status200OK)
        .ProducesValidationProblem(
            StatusCodes.Status400BadRequest);



        // GET: Retrieve a registration by ID
        group.MapGet("/{id:guid}", async (
            Guid id,
            IQueryHandler<GetRegistrationByIdQuery,
                Result<GetRegistrationByIdResponse>> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetRegistrationByIdQuery(id);

            var result = await handler.HandleAsync(
                query,
                cancellationToken);

            if (!result.IsSuccess)
            {
                return result.ToProblemDetails();
            }

            return Results.Ok(result.Value);
        })
        .WithName("GetRegistrationById")
        .Produces<GetRegistrationByIdResponse>(
            StatusCodes.Status200OK)
        .ProducesProblem(
            StatusCodes.Status404NotFound);



        // GET: Retrieve registration summary statistics
        group.MapGet("/summary", async (
            IQueryHandler<GetRegistrationSummaryQuery,
                Result<GetRegistrationSummaryResponse>> handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetRegistrationSummaryQuery();

            var result = await handler.HandleAsync(
                query,
                cancellationToken);

            if (!result.IsSuccess)
            {
                return result.ToProblemDetails();
            }

            return Results.Ok(result.Value);
        })
        .WithName("GetRegistrationSummary")
        .Produces<GetRegistrationSummaryResponse>(
            StatusCodes.Status200OK);


    }
}
