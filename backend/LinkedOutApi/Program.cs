using LinkedOutApi;
using Marten;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(builder => // "Promiscuous Mode"
{
    builder.AddDefaultPolicy(pol =>
    {
        pol.AllowAnyOrigin();
        pol.AllowAnyMethod();
        pol.AllowAnyHeader();
    });
});

var connectionString = builder.Configuration.GetConnectionString("database") ?? throw new Exception("We need a database");

builder.Services.AddMarten(options =>
{
    options.Connection(connectionString);
}).UseLightweightSessions();

builder.Services.AddScoped<UserService>();
var app = builder.Build();


app.UseCors();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapPost("/user/counter", async (CounterRequest request,
    IDocumentSession session,
    UserService user) =>
{
    var userId = await user.GetUserId();
    var doc = new UserCounter(userId, request.Current, request.By);
    session.Store(doc);
    await session.SaveChangesAsync();
    return Results.Ok(doc);
});

app.MapGet("/user/counter", async (IDocumentSession session, UserService user) =>
{
    var userId = await user.GetUserId();
    var doc = await session.Query<UserCounter>().SingleOrDefaultAsync(u => u.Id == userId);
    if (doc is null)
    {
        return Results.NotFound();
    }
    else
    {
        return Results.Ok(doc);
    }
});

app.Run();


public record CounterRequest(int Current, int By);
public record UserCounter(Guid Id, int Current, int By);