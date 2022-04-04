using Homelessness.Domain.Entities;
using Homelessness.Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Migrations.Operations;

#nullable disable

namespace Homelessness.Api.Migrations
{
    public partial class Populate_RegistrationFields : Migration
    {
        private static string tableName = "RegistrationFields";

        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var columns = new string[] 
            { 
                nameof(RegistrationField.Id), 
                nameof(RegistrationField.Name), 
                nameof(RegistrationField.DisplayName),
                nameof(RegistrationField.Description),
                nameof(RegistrationField.IsActive)
            };

            var values = new object[][]
            {
                new object[]
                {
                    Guid.NewGuid(),
                    nameof(ApplicationUser.FirstName),
                    "First Name",
                    "",
                    true
                },
                new object[]
                {
                    Guid.NewGuid(),
                    nameof(ApplicationUser.LastName),
                    "Last Name",
                    "",
                    true
                },
                new object[]
                {
                    Guid.NewGuid(),
                    nameof(ApplicationUser.Email),
                    "Email address",
                    "",
                    true
                },
                new object[]
                {
                    Guid.NewGuid(),
                    "Password",
                    "Password",
                    "",
                    true
                },
                new object[]
                {
                    Guid.NewGuid(),
                    "ConfirmPassword",
                    "Confirm password",
                    "",
                    true
                },
                new object[]
                {
                    Guid.NewGuid(),
                    "Role",
                    "Role",
                    "",
                    true
                },
                new object[]
                {
                    Guid.NewGuid(),
                    nameof(ApplicationUser.UserName),
                    "Username",
                    "",
                    false
                },
                new object[]
                {
                    Guid.NewGuid(),
                    nameof(ApplicationUser.PhoneNumber),
                    "Phone number",
                    "",
                    false
                }
            };

            foreach (var record in values)
            {
                migrationBuilder.InsertData(tableName, columns, record);
            }
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Operations.Add(new SqlOperation
            { 
                Sql = "delete from public.\"RegistrationFields\""
            });
        }
    }
}
