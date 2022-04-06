using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Homelessness.Api.Migrations
{
    public partial class Alter_Saving_Entity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FicoScore",
                table: "Savings",
                newName: "SavingsType");

            migrationBuilder.RenameColumn(
                name: "Amount",
                table: "Savings",
                newName: "Value");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Value",
                table: "Savings",
                newName: "Amount");

            migrationBuilder.RenameColumn(
                name: "SavingsType",
                table: "Savings",
                newName: "FicoScore");
        }
    }
}
