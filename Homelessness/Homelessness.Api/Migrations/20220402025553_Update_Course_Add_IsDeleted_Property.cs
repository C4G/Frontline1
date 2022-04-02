using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Homelessness.Api.Migrations
{
    public partial class Update_Course_Add_IsDeleted_Property : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Courses",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Courses");
        }
    }
}
