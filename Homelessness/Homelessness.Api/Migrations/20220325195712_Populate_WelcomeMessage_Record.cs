using Homelessness.Domain.Entities;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Homelessness.Api.Migrations
{
    public partial class Populate_WelcomeMessage_Record : Migration
    {
        private static string tableName = "WelcomeMessages";

        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var columns = new string[] { nameof(WelcomeMessage.Id), nameof(WelcomeMessage.Message), nameof(WelcomeMessage.CreatedDate) };
            var values = new object[] { Guid.NewGuid(), "Welcome", DateTimeOffset.Now };
            migrationBuilder.InsertData(tableName, columns, values);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@$"
                truncate table {tableName}
                Go
            ");
        }
    }
}
