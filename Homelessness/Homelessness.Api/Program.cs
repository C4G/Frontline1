using Homelessness.Api;
using Homelessness.Api.Infrastructure;
using Homelessness.Api.Infrastructure.Repositories;
using Homelessness.Api.PipelineBehaviors;
using Homelessness.Core.Interfaces;
using Homelessness.Core.Interfaces.Repositories;
using Homelessness.Core.Services;
using Homelessness.Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

string AllowOrigins = "HomelessnessAllowOrigins";

// Add services to the container.

builder.Services.AddDbContext<HomelessnessDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration["HomesslessDbSettings:ConnectionString"]);
});

// Configure Identity
//builder.Services
//    .AddIdentity<ApplicationUser, ApplicationRole>(identityOptions =>
//    {
//        identityOptions.Password.RequiredLength = 6;
//        identityOptions.Password.RequireLowercase = true;
//        identityOptions.Password.RequireUppercase = true;
//        identityOptions.Password.RequireNonAlphanumeric = true;
//        identityOptions.Password.RequireDigit = true;
//    })
//    //.AddUserStore<HomelessnessDbContext>()
//    .AddDefaultTokenProviders();
////.AddRoleStore<HomelessnessDbContext>();

builder.Services
    .AddIdentity<ApplicationUser, ApplicationRole>()
    .AddEntityFrameworkStores<HomelessnessDbContext>()
    .AddDefaultTokenProviders();


// Add Jwt Authentication
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear(); // => remove default claims

builder.Services.AddAuthentication(options =>
{
    //Set default Authentication Schema as Bearer
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = builder.Configuration["JwtIssuer"],
        ValidAudience = builder.Configuration["JwtIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtKey"])),
        ClockSkew = TimeSpan.Zero // remove delay of token when expire
    };
});

// Populate HomesslessDbSettings
builder.Services.Configure<HomesslessDbSettings>(builder.Configuration.GetSection("HomesslessDbSettings"));
builder.Services.AddSingleton<IHomesslessDbSettings>(serviceProvider =>
    serviceProvider.GetRequiredService<IOptions<HomesslessDbSettings>>().Value);

builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Inject Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
builder.Services.AddScoped<IResponseRepository, ResponseRepository>();
builder.Services.AddScoped<ISavingRepository, SavingRepository>();
builder.Services.AddScoped<IFileRepository, FileRepository>();

builder.Services.AddCors(o =>
{
    o.AddPolicy(AllowOrigins, options =>
    {
        options.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register MediatR
builder.Services.AddMediatR(AppDomain.CurrentDomain.GetAssemblies());

// Register the behaviors for any TRequest and any TResponse
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

var app = builder.Build();
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.UseSwagger();
app.UseSwaggerUI();

builder.Services.EnsureHomelessnessDbIsCreated();

app.UseHttpsRedirection();

app.UseCors(AllowOrigins);

app.UseAuthentication();

// Seed default Users and Roles
var serviceProvider = builder.Services.BuildServiceProvider();
var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
var roleManager = serviceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
IdentityDataInitializer.SeedData(userManager, roleManager);

app.UseAuthorization();

app.MapControllers();

app.Run();
