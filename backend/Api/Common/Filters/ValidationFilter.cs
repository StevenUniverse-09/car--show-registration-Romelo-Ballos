
using FluentValidation;

namespace Api.Common.Filters;

public sealed class ValidationFilter<T> : IEndpointFilter
    where T : class
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        // Retrieve the validator from dependency injection
        var validator = context.HttpContext.RequestServices
            .GetRequiredService<IValidator<T>>();

        // Retrieve the request argument
        var request = context.Arguments.OfType<T>().FirstOrDefault();

        if (request is null)
        {
            return Results.Problem(
                title: "Registration.Validation",
                detail: "The request is missing or invalid.",
                statusCode: StatusCodes.Status400BadRequest);
        }

        // Validate the request
        var validationResult = await validator.ValidateAsync(
            request,
            context.HttpContext.RequestAborted);

        // Return validation errors if the request is invalid
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage)
                        .Distinct()
                        .ToArray());

            return Results.ValidationProblem(
                errors,
                title: "Registration.Validation",
                statusCode: StatusCodes.Status400BadRequest);
        }

        // Continue to the endpoint if validation succeeds
        return await next(context);
    }
}
