using Homelessness.Core.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Homelessness.Infrastructure
{
    public class HomelessnessDbContext : DbContext
    {
        public HomelessnessDbContext(DbContextOptions<HomelessnessDbContext> options) : base(options)
        {
            Database.Migrate();
        }
    }

    public static class HomelessnessDbContextExtensions
    {
        public static void AddExecutionTrackingDb(this IServiceCollection services, IHomesslessDbSettings homesslessDbSettings)
        {
            services.AddDbContext<HomelessnessDbContext>(options =>
            {
                options.UseNpgsql(homesslessDbSettings.ConnectionString);
            });
        }

        //public static void EnsureHomelessnessDbIsCreated(this IApplicationBuilder app)
        //{
        //    using var scope = app.ApplicationServices.CreateScope();
        //    var context = scope.ServiceProvider.GetService<HomelessnessDbContext>();
        //    context.Database.EnsureCreated();
        //    context.Database.CloseConnection();
        //}

        public static void EnsureHomelessnessDbIsCreated(this IServiceCollection services)
        {
            using var serviceProvider = services.BuildServiceProvider();
            var context = serviceProvider.GetService<HomelessnessDbContext>();
            context?.Database.EnsureCreated();
            context?.Database.CloseConnection();
        }
    }
}
