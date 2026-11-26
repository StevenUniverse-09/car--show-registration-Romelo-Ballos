using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using FluentValidation;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Application.Features.Registrations.CreateRegistration;
using Application.Features.Registrations.GetRegistrations;
using Application.Features.Registrations.GetRegistrationById;
using Application.Features.Registrations.GetRegistrationSummary;
using Api.Features.Registrations;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<IAppDbContext, AppDbContext>(options =>
    options.UseSqlite("Data Source=carshow.db"));

// Validators
builder.Services.AddValidatorsFromAssembly(typeof(IAppDbContext).Assembly);


// Handlers

// Create Registration
builder.Services.AddScoped<
    ICommandHandler<CreateRegistrationCommand,
        Result<CreateRegistrationResponse>>,
    CreateRegistrationHandler>();

// Get Registrations
builder.Services.AddScoped<
    IQueryHandler<GetRegistrationsQuery,
        Result<GetRegistrationsResponse>>,
    GetRegistrationsHandler>();

// Get Registration By ID
builder.Services.AddScoped<
    IQueryHandler<GetRegistrationByIdQuery,
        Result<GetRegistrationByIdResponse>>,
    GetRegistrationByIdHandler>();

// Get Registration Summary
builder.Services.AddScoped<
    IQueryHandler<GetRegistrationSummaryQuery,
        Result<GetRegistrationSummaryResponse>>,
    GetRegistrationSummaryHandler>();


// JSON enum serialization
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(
        new JsonStringEnumConverter(allowIntegerValues: false));
});



// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});



// API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, _, _) =>
    {
        document.Info.Title = "Vertical Slice API Template by Elvin Manuel R. Luces, MIT";
        document.Info.Description = "A simple API demonstrating Vertical Slice Architecture";
        return Task.CompletedTask;
    });
});

var app = builder.Build();


// Enable CORS
app.UseCors("ReactFrontend");


// Seed data
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider
        .GetRequiredService<AppDbContext>();

    await DatabaseSeeder.SeedAsync(dbContext);
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// Root endpoint
app.MapGet("/", () => "Welcome to the Vertical Slice API! Go to /scalar/v1 for API documentation.");

// Map endpoints
app.MapRegistrationEndpoints();

app.Run();