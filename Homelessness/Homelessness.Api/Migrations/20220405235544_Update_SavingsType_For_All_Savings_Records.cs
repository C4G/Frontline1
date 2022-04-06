using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Homelessness.Api.Migrations
{
    public partial class Update_SavingsType_For_All_Savings_Records : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var tableName = "Savings";
            var column = "SavingsType";
            migrationBuilder.Sql($"UPDATE public.\"{tableName}\" SET \"{column}\" = 2");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
