using Homelessness.Domain.Entities;
using Homelessness.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Homelessness.Api.Infrastructure
{
    public class HomelessnessDbContext : DbContext
    {
        public DbSet<ApplicationUser> Users { get; set; }

        public DbSet<ApplicationRole> Roles { get; set; }

        //public DbSet<UserRole> UsersRoles { get; set; }

        public DbSet<IdentityUserRole<Guid>> IdentityUserRoles { get; set; }
        public DbSet<IdentityUserClaim<Guid>> IdentityUserClaims { get; set; }
        public DbSet<IdentityRoleClaim<Guid>> IdentityRoleClaims { get; set; }

        public DbSet<Course> Courses { get; set; }

        public DbSet<Question> Questions { get; set; }

        public DbSet<Response> Responses { get; set; }

        public DbSet<Saving> Savings { get; set; }

        public HomelessnessDbContext(DbContextOptions<HomelessnessDbContext> options) : base(options)
        {
            Database.Migrate();
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //builder.Entity<UserRole>()
            //    .HasKey(ur => new { ur.UserId, ur.RoleId });

            builder.Entity<IdentityUserRole<Guid>>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });
        }
    }

    public static class HomelessnessDbContextExtensions
    {
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
