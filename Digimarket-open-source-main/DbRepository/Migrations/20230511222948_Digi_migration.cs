using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DbRepository.Migrations
{
    /// <inheritdoc />
    public partial class Digimigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "admin",
                columns: table => new
                {
                    adminid = table.Column<int>(name: "admin_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    admintypeid = table.Column<string>(name: "admin_type_id", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    userid = table.Column<string>(name: "user_id", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    emailaddress = table.Column<string>(name: "email_address", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_admin", x => x.adminid);
                })
                .Annotation("MySql:CharSet", "utf8")
                .Annotation("Relational:Collation", "utf8_general_ci");

            migrationBuilder.CreateTable(
                name: "organization_owner",
                columns: table => new
                {
                    organizationuserid = table.Column<int>(name: "organization_user_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    userid = table.Column<int>(name: "user_id", type: "int", nullable: true),
                    emailaddress = table.Column<string>(name: "email_address", type: "varchar(65)", maxLength: 65, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    firstname = table.Column<string>(name: "first_name", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    middlename = table.Column<string>(name: "middle_name", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    lastname = table.Column<string>(name: "last_name", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    Profileinfo = table.Column<string>(name: "Profile_info", type: "varchar(5000)", maxLength: 5000, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.organizationuserid);
                })
                .Annotation("MySql:CharSet", "utf8")
                .Annotation("Relational:Collation", "utf8_general_ci");

            migrationBuilder.CreateTable(
                name: "parent",
                columns: table => new
                {
                    parentid = table.Column<int>(name: "parent_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    username = table.Column<string>(name: "user_name", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    userid = table.Column<string>(name: "user_id", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    emailaddress = table.Column<string>(name: "email_address", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_parent", x => x.parentid);
                })
                .Annotation("MySql:CharSet", "utf8")
                .Annotation("Relational:Collation", "utf8_general_ci");

            migrationBuilder.CreateTable(
                name: "parent_student",
                columns: table => new
                {
                    Parentstudentid = table.Column<int>(name: "Parent_student_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    parentid = table.Column<string>(name: "parent_id", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    studentid = table.Column<string>(name: "student_id", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    relationtype = table.Column<string>(name: "relation_type", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    organizationid = table.Column<string>(name: "organization_id", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_parent_student", x => x.Parentstudentid);
                })
                .Annotation("MySql:CharSet", "utf8")
                .Annotation("Relational:Collation", "utf8_general_ci");

            migrationBuilder.CreateTable(
                name: "permission",
                columns: table => new
                {
                    permissionid = table.Column<int>(name: "permission_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    description = table.Column<string>(type: "varchar(4000)", maxLength: 4000, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    displayname = table.Column<string>(name: "display_name", type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_permission", x => x.permissionid);
                })
                .Annotation("MySql:CharSet", "utf8")
                .Annotation("Relational:Collation", "utf8_general_ci");

            migrationBuilder.CreateTable(
                name: "privillage",
                columns: table => new
                {
                    privillageid = table.Column<int>(name: "privillage_id", type: "int", nullable: false),
                    name = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    details = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    ismandatory = table.Column<string>(name: "is_mandatory", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    organizationid = table.Column<string>(name: "organization_id", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_privillage", x => x.privillageid);
                })
                .Annotation("MySql:CharSet", "utf8")
                .Annotation("Relational:Collation", "utf8_general_ci");

            migrationBuilder.CreateTable(
                name: "privillage_permission",
                columns: table => new
                {
                    rolepermissionid = table.Column<int>(name: "role_permission_id", type: "int", nullable: false),
                    roleid = table.Column<string>(name: "role_id", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    permissionid = table.Column<string>(name: "permission_id", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    organizationid = table.Column<string>(name: "organization_id", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.rolepermissionid);
                })
                .Annotation("MySql:CharSet", "utf8")
                .Annotation("Relational:Collation", "utf8_general_ci");

            migrationBuilder.CreateTable(
                name: "student",
                columns: table => new
                {
                    studentid = table.Column<int>(name: "student_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    firstname = table.Column<string>(name: "first_name", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    middlename = table.Column<string>(name: "middle_name", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    lastname = table.Column<string>(name: "last_name", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    username = table.Column<string>(name: "user_name", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    dob = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    modifieddate = table.Column<string>(name: "modified_date", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    createdip = table.Column<string>(name: "created_ip", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    modifiedid = table.Column<string>(name: "modified_id", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    createdby = table.Column<int>(name: "created_by", type: "int", nullable: true),
                    modifiedby = table.Column<int>(name: "modified_by", type: "int", nullable: true),
                    userid = table.Column<string>(name: "user_id", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    hasemail = table.Column<ulong>(name: "has_email", type: "bit(1)", nullable: true),
                    emailaddress = table.Column<string>(name: "email_address", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_student", x => x.studentid);
                })
                .Annotation("MySql:CharSet", "utf8")
                .Annotation("Relational:Collation", "utf8_general_ci");

            migrationBuilder.CreateTable(
                name: "teacher",
                columns: table => new
                {
                    teacherid = table.Column<int>(name: "teacher_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    username = table.Column<string>(name: "user_name", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    userid = table.Column<string>(name: "user_id", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    emailaddress = table.Column<string>(name: "email_address", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_teacher", x => x.teacherid);
                })
                .Annotation("MySql:CharSet", "utf8")
                .Annotation("Relational:Collation", "utf8_general_ci");

            migrationBuilder.CreateTable(
                name: "user",
                columns: table => new
                {
                    userid = table.Column<int>(name: "user_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    firstname = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    lastname = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    email = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    password = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    isActive = table.Column<ulong>(name: "is_Active", type: "bit(1)", nullable: true),
                    isroot = table.Column<ulong>(name: "is_root", type: "bit(1)", nullable: true),
                    parentid = table.Column<int>(name: "parent_id", type: "int", nullable: true),
                    dob = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    contactnumber = table.Column<string>(name: "contact_number", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    isplatformadmin = table.Column<ulong>(name: "is_platform_admin", type: "bit(1)", nullable: true),
                    image = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user", x => x.userid);
                })
                .Annotation("MySql:CharSet", "utf8")
                .Annotation("Relational:Collation", "utf8_general_ci");

            migrationBuilder.CreateTable(
                name: "user_privillage",
                columns: table => new
                {
                    userprivillageid = table.Column<int>(name: "user_privillage_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    userid = table.Column<string>(name: "user_id", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    privillageid = table.Column<string>(name: "privillage_id", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    organizationid = table.Column<string>(name: "organization_id", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_privillage", x => x.userprivillageid);
                })
                .Annotation("MySql:CharSet", "utf8")
                .Annotation("Relational:Collation", "utf8_general_ci");

            migrationBuilder.CreateTable(
                name: "user_registration",
                columns: table => new
                {
                    userregistrationid = table.Column<int>(name: "user_registration_id", type: "int", nullable: false),
                    firstname = table.Column<string>(name: "first_name", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    middlename = table.Column<string>(name: "middle_name", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    lastname = table.Column<string>(name: "last_name", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    emailaddress = table.Column<string>(name: "email_address", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    phonenumber = table.Column<string>(name: "phone_number", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    country = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    province = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    city = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    usertype = table.Column<string>(name: "user_type", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    isapproved = table.Column<string>(name: "is_approved", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    convertedid = table.Column<string>(name: "converted_id", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_registration", x => x.userregistrationid);
                })
                .Annotation("MySql:CharSet", "utf8")
                .Annotation("Relational:Collation", "utf8_general_ci");

            migrationBuilder.CreateTable(
                name: "organization",
                columns: table => new
                {
                    organizationid = table.Column<int>(name: "organization_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    endpoint = table.Column<string>(name: "end_point", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    isactive = table.Column<ulong>(name: "is_active", type: "bit(1)", nullable: true),
                    emailaddress = table.Column<string>(name: "email_address", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    aboutorganziation = table.Column<string>(name: "about_organziation", type: "varchar(1000)", maxLength: 1000, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    logo = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    country = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    address = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    contactnumber = table.Column<string>(name: "contact_number", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    typeoforganization = table.Column<int>(name: "type_of_organization", type: "int", nullable: true),
                    isapproved = table.Column<ulong>(name: "is_approved", type: "bit(1)", nullable: true),
                    isrejected = table.Column<ulong>(name: "is_rejected", type: "bit(1)", nullable: true),
                    approvedby = table.Column<int>(name: "approved_by", type: "int", nullable: true),
                    rejectedby = table.Column<int>(name: "rejected_by", type: "int", nullable: true),
                    reason = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    creator = table.Column<int>(type: "int", nullable: true),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    updateddate = table.Column<string>(name: "updated_date", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    isdeleted = table.Column<ulong>(name: "is_deleted", type: "bit(1)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_organization", x => x.organizationid);
                    table.ForeignKey(
                        name: "approved_by",
                        column: x => x.approvedby,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "creator",
                        column: x => x.creator,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "rejected_by",
                        column: x => x.rejectedby,
                        principalTable: "user",
                        principalColumn: "user_id");
                })
                .Annotation("MySql:CharSet", "utf8")
                .Annotation("Relational:Collation", "utf8_general_ci");

            migrationBuilder.CreateTable(
                name: "organization_request",
                columns: table => new
                {
                    organizationrequestid = table.Column<int>(name: "organization_request_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    emailaddress = table.Column<string>(name: "email_address", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    organizationname = table.Column<string>(name: "organization_name", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    organizationid = table.Column<int>(name: "organization_id", type: "int", nullable: true),
                    firstname = table.Column<string>(name: "first_name", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    lastname = table.Column<string>(name: "last_name", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    organizationisapproved = table.Column<ulong>(name: "organization_is_approved", type: "bit(1)", nullable: true),
                    organizationapprovedby = table.Column<int>(name: "organization_approved_by", type: "int", nullable: true),
                    organizationisrejected = table.Column<ulong>(name: "organization_is_rejected", type: "bit(1)", nullable: true),
                    organizationrejectedby = table.Column<int>(name: "organization_rejected_by", type: "int", nullable: true),
                    reason = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    about = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    logo = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    country = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    address = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    contactnumber = table.Column<string>(name: "contact_number", type: "varchar(200)", maxLength: 200, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    iseditrequest = table.Column<ulong>(name: "is_edit_request", type: "bit(1)", nullable: true),
                    organizationtype = table.Column<int>(name: "organization_type", type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_organization_request", x => x.organizationrequestid);
                    table.ForeignKey(
                        name: "organization_approved_by",
                        column: x => x.organizationapprovedby,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "organization_rejected_by",
                        column: x => x.organizationrejectedby,
                        principalTable: "user",
                        principalColumn: "user_id");
                })
                .Annotation("MySql:CharSet", "utf8")
                .Annotation("Relational:Collation", "utf8_general_ci");

            migrationBuilder.CreateTable(
                name: "username_login_student",
                columns: table => new
                {
                    usernameloginstudentid = table.Column<int>(name: "username_login_student_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    firstname = table.Column<string>(name: "first_name", type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    lastname = table.Column<string>(name: "last_name", type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dob = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    linkparentid = table.Column<int>(name: "link_parent_id", type: "int", nullable: false),
                    username = table.Column<string>(name: "user_name", type: "varchar(100)", maxLength: 100, nullable: false, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    statusid = table.Column<int>(name: "status_id", type: "int", nullable: true),
                    status = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    createdby = table.Column<int>(name: "created_by", type: "int", nullable: false),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    isparent = table.Column<ulong>(name: "is_parent", type: "bit(1)", nullable: true),
                    isshareinfo = table.Column<ulong>(name: "is_share_info", type: "bit(1)", nullable: true),
                    userid = table.Column<int>(name: "user_id", type: "int", nullable: true),
                    image = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    isdeleted = table.Column<ulong>(name: "is_deleted", type: "bit(1)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_username_login_student", x => x.usernameloginstudentid);
                    table.ForeignKey(
                        name: "username_login_student_created_by",
                        column: x => x.createdby,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "username_login_student_link_parent_id",
                        column: x => x.linkparentid,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "username_login_student_user_id",
                        column: x => x.userid,
                        principalTable: "user",
                        principalColumn: "user_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "contact_us",
                columns: table => new
                {
                    contactusid = table.Column<int>(name: "contact_us_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    firstName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    lastName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    emailAddress = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    phone = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    topic = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    message = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    contactusorganizationid = table.Column<int>(name: "contact_us_organization_id", type: "int", nullable: true),
                    createdby = table.Column<int>(name: "created_by", type: "int", nullable: true),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    isarchived = table.Column<ulong>(name: "is_archived", type: "bit(1)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.contactusid);
                    table.ForeignKey(
                        name: "contact_us_created_by",
                        column: x => x.createdby,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "contact_us_organization_id",
                        column: x => x.contactusorganizationid,
                        principalTable: "organization",
                        principalColumn: "organization_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "course",
                columns: table => new
                {
                    courseid = table.Column<int>(name: "course_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    coursename = table.Column<string>(name: "course_name", type: "varchar(100)", maxLength: 100, nullable: false, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    coursedescription = table.Column<string>(name: "course_description", type: "varchar(1000)", maxLength: 1000, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    organizationid = table.Column<int>(name: "organization_id", type: "int", nullable: false),
                    createdby = table.Column<int>(name: "created_by", type: "int", nullable: false),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_course", x => x.courseid);
                    table.ForeignKey(
                        name: "course_created_by",
                        column: x => x.createdby,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "course_organization_id",
                        column: x => x.organizationid,
                        principalTable: "organization",
                        principalColumn: "organization_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "course_location",
                columns: table => new
                {
                    courselocationid = table.Column<int>(name: "course_location_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    location = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    details = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    organizationid = table.Column<int>(name: "organization_id", type: "int", nullable: false),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    createdby = table.Column<int>(name: "created_by", type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_course_location", x => x.courselocationid);
                    table.ForeignKey(
                        name: "course_location_created_by",
                        column: x => x.createdby,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "course_location_organization_id",
                        column: x => x.organizationid,
                        principalTable: "organization",
                        principalColumn: "organization_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "role",
                columns: table => new
                {
                    roleid = table.Column<int>(name: "role_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    details = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ismandatory = table.Column<ulong>(name: "is_mandatory", type: "bit(1)", nullable: true),
                    organizationid = table.Column<int>(name: "organization_id", type: "int", nullable: false),
                    displayname = table.Column<string>(name: "display_name", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    createdby = table.Column<int>(name: "created_by", type: "int", nullable: false),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_role", x => x.roleid);
                    table.ForeignKey(
                        name: "role_created_by",
                        column: x => x.createdby,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "role_organization_id",
                        column: x => x.organizationid,
                        principalTable: "organization",
                        principalColumn: "organization_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "user_content",
                columns: table => new
                {
                    contentid = table.Column<int>(name: "content_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    userid = table.Column<int>(name: "user_id", type: "int", nullable: false),
                    name = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    isduplicate = table.Column<ulong>(name: "is_duplicate", type: "bit(1)", nullable: false),
                    organizationid = table.Column<int>(name: "organization_id", type: "int", nullable: false),
                    createdby = table.Column<int>(name: "created_by", type: "int", nullable: false),
                    shortdescription = table.Column<string>(name: "short_description", type: "longtext", nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    longdescription = table.Column<string>(name: "long_description", type: "longtext", nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    duplicatedfrom = table.Column<int>(name: "duplicated_from", type: "int", nullable: true),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    usercontentguid = table.Column<string>(name: "user_content_guid", type: "varchar(300)", maxLength: 300, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.contentid);
                    table.ForeignKey(
                        name: "created_by",
                        column: x => x.createdby,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "duplicated_from",
                        column: x => x.duplicatedfrom,
                        principalTable: "user_content",
                        principalColumn: "content_id");
                    table.ForeignKey(
                        name: "organization_id",
                        column: x => x.organizationid,
                        principalTable: "organization",
                        principalColumn: "organization_id");
                    table.ForeignKey(
                        name: "user_id",
                        column: x => x.userid,
                        principalTable: "user",
                        principalColumn: "user_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "user_organization",
                columns: table => new
                {
                    userorganizationid = table.Column<int>(name: "user_organization_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    userid = table.Column<int>(name: "user_id", type: "int", nullable: false),
                    organizationid = table.Column<int>(name: "organization_id", type: "int", nullable: false),
                    isselected = table.Column<ulong>(name: "is_selected", type: "bit(1)", nullable: true),
                    cretaedby = table.Column<int>(name: "cretaed_by", type: "int", nullable: true),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    islinked = table.Column<ulong>(name: "is_linked", type: "bit(1)", nullable: true),
                    linkeduserorganizationid = table.Column<int>(name: "linked_user_organization_id", type: "int", nullable: true),
                    isactive = table.Column<ulong>(name: "is_active", type: "bit(1)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_organization", x => x.userorganizationid);
                    table.ForeignKey(
                        name: "user_organization_created_by",
                        column: x => x.cretaedby,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "user_organization_organization_id",
                        column: x => x.organizationid,
                        principalTable: "organization",
                        principalColumn: "organization_id");
                    table.ForeignKey(
                        name: "user_organization_user_id",
                        column: x => x.userid,
                        principalTable: "user",
                        principalColumn: "user_id");
                })
                .Annotation("MySql:CharSet", "utf8")
                .Annotation("Relational:Collation", "utf8_general_ci");

            migrationBuilder.CreateTable(
                name: "user_organization_emails",
                columns: table => new
                {
                    userorganizationemailid = table.Column<int>(name: "user_organization_email_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    userid = table.Column<int>(name: "user_id", type: "int", nullable: false),
                    organizationid = table.Column<int>(name: "organization_id", type: "int", nullable: true),
                    email = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    pin = table.Column<int>(type: "int", nullable: true),
                    pingeneratedat = table.Column<string>(name: "pin_generated_at", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    isverified = table.Column<ulong>(name: "is_verified", type: "bit(1)", nullable: false),
                    isnotificationon = table.Column<ulong>(name: "is_notification_on", type: "bit(1)", nullable: false),
                    isprimary = table.Column<ulong>(name: "is_primary", type: "bit(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_organization_emails", x => x.userorganizationemailid);
                    table.ForeignKey(
                        name: "user_organization_email_organization_id",
                        column: x => x.organizationid,
                        principalTable: "organization",
                        principalColumn: "organization_id");
                    table.ForeignKey(
                        name: "user_organization_email_user_id",
                        column: x => x.userid,
                        principalTable: "user",
                        principalColumn: "user_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "username_login_student_organization",
                columns: table => new
                {
                    usernameloginstudentorganizationid = table.Column<int>(name: "username_login_student_organization_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    usernameloginstudentid = table.Column<int>(name: "username_login_student_id", type: "int", nullable: false),
                    organizationid = table.Column<int>(name: "organization_id", type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_username_login_student_organization", x => x.usernameloginstudentorganizationid);
                    table.ForeignKey(
                        name: "username_login_student_id",
                        column: x => x.usernameloginstudentid,
                        principalTable: "username_login_student",
                        principalColumn: "username_login_student_id");
                    table.ForeignKey(
                        name: "username_login_student_organization_organization_id",
                        column: x => x.organizationid,
                        principalTable: "organization",
                        principalColumn: "organization_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "course_schedule",
                columns: table => new
                {
                    coursescheduleid = table.Column<int>(name: "course_schedule_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    courseid = table.Column<int>(name: "course_id", type: "int", nullable: false),
                    organizationid = table.Column<int>(name: "organization_id", type: "int", nullable: false),
                    createdby = table.Column<int>(name: "created_by", type: "int", nullable: false),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(1000)", maxLength: 1000, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_course_schedule", x => x.coursescheduleid);
                    table.ForeignKey(
                        name: "course_schedule_course_id",
                        column: x => x.courseid,
                        principalTable: "course",
                        principalColumn: "course_id");
                    table.ForeignKey(
                        name: "course_schedule_created_by",
                        column: x => x.createdby,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "course_schedule_organization_id",
                        column: x => x.organizationid,
                        principalTable: "organization",
                        principalColumn: "organization_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "role_permission",
                columns: table => new
                {
                    rolepermissionid = table.Column<int>(name: "role_permission_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    roleid = table.Column<int>(name: "role_id", type: "int", nullable: false),
                    permissionid = table.Column<int>(name: "permission_id", type: "int", nullable: false),
                    createdby = table.Column<int>(name: "created_by", type: "int", nullable: false),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_role_permission", x => x.rolepermissionid);
                    table.ForeignKey(
                        name: "permission_id",
                        column: x => x.permissionid,
                        principalTable: "permission",
                        principalColumn: "permission_id");
                    table.ForeignKey(
                        name: "role_id",
                        column: x => x.roleid,
                        principalTable: "role",
                        principalColumn: "role_id");
                    table.ForeignKey(
                        name: "role_permission_created_by",
                        column: x => x.createdby,
                        principalTable: "user",
                        principalColumn: "user_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "user_invite",
                columns: table => new
                {
                    userinviteid = table.Column<int>(name: "user_invite_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    emailaddress = table.Column<string>(name: "email_address", type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    firstname = table.Column<string>(name: "first_name", type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    lastname = table.Column<string>(name: "last_name", type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    createdby = table.Column<int>(name: "created_by", type: "int", nullable: false),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8_general_ci")
                        .Annotation("MySql:CharSet", "utf8"),
                    registereduserid = table.Column<int>(name: "registered_user_id", type: "int", nullable: true),
                    roleid = table.Column<int>(name: "role_id", type: "int", nullable: false),
                    organizationid = table.Column<int>(name: "organization_id", type: "int", nullable: false),
                    accepted = table.Column<ulong>(type: "bit(1)", nullable: true),
                    rejected = table.Column<ulong>(type: "bit(1)", nullable: true),
                    isinvitationsent = table.Column<ulong>(name: "is_invitation_sent", type: "bit(1)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_invite", x => x.userinviteid);
                    table.ForeignKey(
                        name: "user_invite_created_by",
                        column: x => x.createdby,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "user_invite_organization_id",
                        column: x => x.organizationid,
                        principalTable: "organization",
                        principalColumn: "organization_id");
                    table.ForeignKey(
                        name: "user_invite_registered_user_id",
                        column: x => x.registereduserid,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "user_invite_role_id",
                        column: x => x.roleid,
                        principalTable: "role",
                        principalColumn: "role_id");
                })
                .Annotation("MySql:CharSet", "utf8")
                .Annotation("Relational:Collation", "utf8_general_ci");

            migrationBuilder.CreateTable(
                name: "user_request",
                columns: table => new
                {
                    userrequestid = table.Column<int>(name: "user_request_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    organizationid = table.Column<int>(name: "organization_id", type: "int", nullable: false),
                    firstname = table.Column<string>(name: "first_name", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    lastname = table.Column<string>(name: "last_name", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    isapproved = table.Column<ulong>(name: "is_approved", type: "bit(1)", nullable: true),
                    approvedby = table.Column<int>(name: "approved_by", type: "int", nullable: true),
                    isrejected = table.Column<ulong>(name: "is_rejected", type: "bit(1)", nullable: true),
                    rejectedby = table.Column<int>(name: "rejected_by", type: "int", nullable: true),
                    reason = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dob = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    contactnumber = table.Column<string>(name: "contact_number", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    roleid = table.Column<int>(name: "role_id", type: "int", nullable: true),
                    userid = table.Column<int>(name: "user_id", type: "int", nullable: true),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_request", x => x.userrequestid);
                    table.ForeignKey(
                        name: "user_request_approved_by",
                        column: x => x.approvedby,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "user_request_organization_id",
                        column: x => x.organizationid,
                        principalTable: "organization",
                        principalColumn: "organization_id");
                    table.ForeignKey(
                        name: "user_request_rejected_by",
                        column: x => x.rejectedby,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "user_request_role_id",
                        column: x => x.roleid,
                        principalTable: "role",
                        principalColumn: "role_id");
                    table.ForeignKey(
                        name: "user_request_user_id",
                        column: x => x.userid,
                        principalTable: "user",
                        principalColumn: "user_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "course_lesson",
                columns: table => new
                {
                    courselessonid = table.Column<int>(name: "course_lesson_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    courseid = table.Column<int>(name: "course_id", type: "int", nullable: false),
                    usercontentid = table.Column<int>(name: "user_content_id", type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_course_lesson", x => x.courselessonid);
                    table.ForeignKey(
                        name: "course_lesson_course_id",
                        column: x => x.courseid,
                        principalTable: "course",
                        principalColumn: "course_id");
                    table.ForeignKey(
                        name: "course_lesson_user_content_id",
                        column: x => x.usercontentid,
                        principalTable: "user_content",
                        principalColumn: "content_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "specific_user_prmission",
                columns: table => new
                {
                    specificuserprmissionid = table.Column<int>(name: "specific_user_prmission_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    contentid = table.Column<int>(name: "content_id", type: "int", nullable: true),
                    isrequested = table.Column<ulong>(name: "is_requested", type: "bit(1)", nullable: true),
                    requestby = table.Column<int>(name: "request_by", type: "int", nullable: true),
                    approvedby = table.Column<int>(name: "approved_by", type: "int", nullable: true),
                    name = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    token = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_specific_user_prmission", x => x.specificuserprmissionid);
                    table.ForeignKey(
                        name: "specific_user_prmission_approved_by",
                        column: x => x.approvedby,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "specific_user_prmission_content_id",
                        column: x => x.contentid,
                        principalTable: "user_content",
                        principalColumn: "content_id");
                    table.ForeignKey(
                        name: "specific_user_prmission_request_by",
                        column: x => x.requestby,
                        principalTable: "user",
                        principalColumn: "user_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "user_content_access_request",
                columns: table => new
                {
                    usercontentaccessrequestid = table.Column<int>(name: "user_content_access_request_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    contentid = table.Column<int>(name: "content_id", type: "int", nullable: false),
                    requestby = table.Column<int>(name: "request_by", type: "int", nullable: true),
                    name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    requesteddate = table.Column<string>(name: "requested_date", type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    approved = table.Column<ulong>(type: "bit(1)", nullable: true),
                    approveddate = table.Column<string>(name: "approved_date", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_content_access_request", x => x.usercontentaccessrequestid);
                    table.ForeignKey(
                        name: "user_content_access_request_content_id",
                        column: x => x.contentid,
                        principalTable: "user_content",
                        principalColumn: "content_id");
                    table.ForeignKey(
                        name: "user_content_access_request_requested_by",
                        column: x => x.requestby,
                        principalTable: "user",
                        principalColumn: "user_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "user_content_attachments",
                columns: table => new
                {
                    attachmentsid = table.Column<int>(name: "attachments_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    usercontentid = table.Column<int>(name: "user_content_id", type: "int", nullable: false),
                    attachmentkey = table.Column<string>(name: "attachment_key", type: "varchar(100)", maxLength: 100, nullable: false, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    createdby = table.Column<int>(name: "created_by", type: "int", nullable: true),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.attachmentsid);
                    table.ForeignKey(
                        name: "attachments_created_by",
                        column: x => x.createdby,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "attachments_user_content_id",
                        column: x => x.usercontentid,
                        principalTable: "user_content",
                        principalColumn: "content_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "user_content_meta",
                columns: table => new
                {
                    usercontentmetaid = table.Column<int>(name: "user_content_meta_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    contentid = table.Column<int>(name: "content_id", type: "int", nullable: false),
                    key = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    value = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    metatype = table.Column<int>(name: "meta_type", type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.usercontentmetaid);
                    table.ForeignKey(
                        name: "user_content_id",
                        column: x => x.contentid,
                        principalTable: "user_content",
                        principalColumn: "content_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "user_content_question",
                columns: table => new
                {
                    usercontentquestionid = table.Column<int>(name: "user_content_question_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    question = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    questiondescription = table.Column<string>(name: "question_description", type: "varchar(2000)", maxLength: 2000, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    answers = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ismultiselect = table.Column<ulong>(name: "is_multiselect", type: "bit(1)", nullable: true),
                    usercontentid = table.Column<int>(name: "user_content_id", type: "int", nullable: false),
                    createdby = table.Column<int>(name: "created_by", type: "int", nullable: false),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_content_question", x => x.usercontentquestionid);
                    table.ForeignKey(
                        name: "user_content_question_created_by",
                        column: x => x.createdby,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "user_content_question_user_content_id",
                        column: x => x.usercontentid,
                        principalTable: "user_content",
                        principalColumn: "content_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "user_content_scratch_project",
                columns: table => new
                {
                    usercontentscratchprojectid = table.Column<int>(name: "user_content_scratch_project_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    link = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    createdby = table.Column<int>(name: "created_by", type: "int", nullable: false),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    usercontentid = table.Column<int>(name: "user_content_id", type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_content_scratch_project", x => x.usercontentscratchprojectid);
                    table.ForeignKey(
                        name: "user_content_scratch_project_content_id",
                        column: x => x.usercontentid,
                        principalTable: "user_content",
                        principalColumn: "content_id");
                    table.ForeignKey(
                        name: "user_content_scratch_project_created_by",
                        column: x => x.createdby,
                        principalTable: "user",
                        principalColumn: "user_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "user_content_sharing_permissions",
                columns: table => new
                {
                    usercontentsharingpermissionsid = table.Column<int>(name: "user_content_sharing_permissions_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    isprivate = table.Column<ulong>(name: "is_private", type: "bit(1)", nullable: true),
                    sharealsowithstudentsofallogranizations = table.Column<ulong>(name: "share_also_with_students_of_all_ogranizations", type: "bit(1)", nullable: true),
                    sharealsowithstudentsofmyogranizations = table.Column<ulong>(name: "share_also_with_students_of_my_ogranizations", type: "bit(1)", nullable: true),
                    sharetoallogranizations = table.Column<ulong>(name: "share_to_all_ogranizations", type: "bit(1)", nullable: true),
                    sharetomyogranizations = table.Column<ulong>(name: "share_to_my_ogranizations", type: "bit(1)", nullable: true),
                    sharedwithspecificpeople = table.Column<ulong>(name: "shared_with_specific_people", type: "bit(1)", nullable: true),
                    permissionsusercontentid = table.Column<int>(name: "permissions_user_content_id", type: "int", nullable: true),
                    sharedtoall = table.Column<ulong>(name: "shared_to_all", type: "bit(1)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.usercontentsharingpermissionsid);
                    table.ForeignKey(
                        name: "permissions_user_content_id",
                        column: x => x.permissionsusercontentid,
                        principalTable: "user_content",
                        principalColumn: "content_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "user_organization_role",
                columns: table => new
                {
                    userorganizationroleid = table.Column<int>(name: "user_organization_role_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    userorganizationid = table.Column<int>(name: "user_organization_id", type: "int", nullable: false),
                    roleid = table.Column<int>(name: "role_id", type: "int", nullable: false),
                    createdby = table.Column<int>(name: "created_by", type: "int", nullable: true),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_organization_role", x => x.userorganizationroleid);
                    table.ForeignKey(
                        name: "user_oganization_role_id",
                        column: x => x.roleid,
                        principalTable: "role",
                        principalColumn: "role_id");
                    table.ForeignKey(
                        name: "user_organization_id",
                        column: x => x.userorganizationid,
                        principalTable: "user_organization",
                        principalColumn: "user_organization_id");
                    table.ForeignKey(
                        name: "user_organization_role_created_by",
                        column: x => x.createdby,
                        principalTable: "user",
                        principalColumn: "user_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "course_schedule_course_details",
                columns: table => new
                {
                    courseschedulecoursedetailsid = table.Column<int>(name: "course_schedule_course_details_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    coursescheduleid = table.Column<int>(name: "course_schedule_id", type: "int", nullable: false),
                    usercontentid = table.Column<int>(name: "user_content_id", type: "int", nullable: false),
                    locationid = table.Column<int>(name: "location_id", type: "int", nullable: true),
                    datetime = table.Column<string>(name: "date_time", type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    teacherid = table.Column<int>(name: "teacher_id", type: "int", nullable: true),
                    maxparticipantscount = table.Column<int>(name: "max_participants_count", type: "int", nullable: true),
                    participantnotificationthreshold = table.Column<int>(name: "participant_notification_threshold", type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.courseschedulecoursedetailsid);
                    table.ForeignKey(
                        name: "course_schedule_course_details_course_schedule_id",
                        column: x => x.coursescheduleid,
                        principalTable: "course_schedule",
                        principalColumn: "course_schedule_id");
                    table.ForeignKey(
                        name: "course_schedule_course_details_location_id",
                        column: x => x.locationid,
                        principalTable: "course_location",
                        principalColumn: "course_location_id");
                    table.ForeignKey(
                        name: "course_schedule_course_details_teacher_id",
                        column: x => x.teacherid,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "course_schedule_course_details_user_content_id",
                        column: x => x.usercontentid,
                        principalTable: "user_content",
                        principalColumn: "content_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "course_schedule_attendance",
                columns: table => new
                {
                    coursescheduleattendanceid = table.Column<int>(name: "course_schedule_attendance_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    courseschedulecoursedetailsid = table.Column<int>(name: "course_schedule_course_details_id", type: "int", nullable: false),
                    userid = table.Column<int>(name: "user_id", type: "int", nullable: false),
                    ispresent = table.Column<ulong>(name: "is_present", type: "bit(1)", nullable: true),
                    createdby = table.Column<int>(name: "created_by", type: "int", nullable: false),
                    createddate = table.Column<string>(name: "created_date", type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_course_schedule_attendance", x => x.coursescheduleattendanceid);
                    table.ForeignKey(
                        name: "course_schedule_attendance_created_by",
                        column: x => x.createdby,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "course_schedule_attendance_user_id",
                        column: x => x.userid,
                        principalTable: "user",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "course_schedule_course_details_id",
                        column: x => x.courseschedulecoursedetailsid,
                        principalTable: "course_schedule_course_details",
                        principalColumn: "course_schedule_course_details_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "course_schedule_members",
                columns: table => new
                {
                    courseschedulemembersid = table.Column<int>(name: "course_schedule_members_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    courseschedulecoursedetails = table.Column<int>(name: "course_schedule_course_details", type: "int", nullable: false),
                    userid = table.Column<int>(name: "user_id", type: "int", nullable: false),
                    membertype = table.Column<int>(name: "member_type", type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.courseschedulemembersid);
                    table.ForeignKey(
                        name: "course_schedule_details",
                        column: x => x.courseschedulecoursedetails,
                        principalTable: "course_schedule_course_details",
                        principalColumn: "course_schedule_course_details_id");
                    table.ForeignKey(
                        name: "course_schedule_member_user_id",
                        column: x => x.userid,
                        principalTable: "user",
                        principalColumn: "user_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "on_going_class_for_user",
                columns: table => new
                {
                    ongoingclassforuserid = table.Column<int>(name: "on_going_class_for_user_id", type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    courseschedulecoursedetailsid = table.Column<int>(name: "course_schedule_course_details_id", type: "int", nullable: false),
                    userid = table.Column<int>(name: "user_id", type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_on_going_class_for_user", x => x.ongoingclassforuserid);
                    table.ForeignKey(
                        name: "on_going_class_for_user_course_schedule_course_details_id",
                        column: x => x.courseschedulecoursedetailsid,
                        principalTable: "course_schedule_course_details",
                        principalColumn: "course_schedule_course_details_id");
                    table.ForeignKey(
                        name: "on_going_class_for_user_user_id",
                        column: x => x.userid,
                        principalTable: "user",
                        principalColumn: "user_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateIndex(
                name: "contact_us_created_by_idx",
                table: "contact_us",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "contact_us_organization_id_idx",
                table: "contact_us",
                column: "contact_us_organization_id");

            migrationBuilder.CreateIndex(
                name: "course_created_by_idx",
                table: "course",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "course_organization_id_idx",
                table: "course",
                column: "organization_id");

            migrationBuilder.CreateIndex(
                name: "course_lesson_course_id_idx",
                table: "course_lesson",
                column: "course_id");

            migrationBuilder.CreateIndex(
                name: "course_lesson_user_content_id_idx",
                table: "course_lesson",
                column: "user_content_id");

            migrationBuilder.CreateIndex(
                name: "course_location_created_by_idx",
                table: "course_location",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "course_location_organization_id_idx",
                table: "course_location",
                column: "organization_id");

            migrationBuilder.CreateIndex(
                name: "course_schedule_course_id_idx",
                table: "course_schedule",
                column: "course_id");

            migrationBuilder.CreateIndex(
                name: "course_schedule_created_by_idx",
                table: "course_schedule",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "course_schedule_organization_id_idx",
                table: "course_schedule",
                column: "organization_id");

            migrationBuilder.CreateIndex(
                name: "course_schedule_attendance_created_by_idx",
                table: "course_schedule_attendance",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "course_schedule_attendance_user_id_idx",
                table: "course_schedule_attendance",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "course_schedule_course_details_id_idx",
                table: "course_schedule_attendance",
                column: "course_schedule_course_details_id");

            migrationBuilder.CreateIndex(
                name: "course_schedule_course_details_course_schedule_id_idx",
                table: "course_schedule_course_details",
                column: "course_schedule_id");

            migrationBuilder.CreateIndex(
                name: "course_schedule_course_details_location_id_idx",
                table: "course_schedule_course_details",
                column: "location_id");

            migrationBuilder.CreateIndex(
                name: "course_schedule_course_details_teacher_id_idx",
                table: "course_schedule_course_details",
                column: "teacher_id");

            migrationBuilder.CreateIndex(
                name: "course_schedule_course_details_user_content_id_idx",
                table: "course_schedule_course_details",
                column: "user_content_id");

            migrationBuilder.CreateIndex(
                name: "course_schedule_details_idx",
                table: "course_schedule_members",
                column: "course_schedule_course_details");

            migrationBuilder.CreateIndex(
                name: "course_schedule_member_user_id_idx",
                table: "course_schedule_members",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "on_going_class_for_user_course_schedule_course_details_id_idx",
                table: "on_going_class_for_user",
                column: "course_schedule_course_details_id");

            migrationBuilder.CreateIndex(
                name: "on_going_class_for_user_user_id_idx",
                table: "on_going_class_for_user",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "approved_by_idx",
                table: "organization",
                column: "approved_by");

            migrationBuilder.CreateIndex(
                name: "organization_creator_idx",
                table: "organization",
                column: "creator");

            migrationBuilder.CreateIndex(
                name: "rejected_by_idx",
                table: "organization",
                column: "rejected_by");

            migrationBuilder.CreateIndex(
                name: "organization_approved_by_id",
                table: "organization_request",
                column: "organization_approved_by");

            migrationBuilder.CreateIndex(
                name: "organization_rejected_by_id",
                table: "organization_request",
                column: "organization_rejected_by");

            migrationBuilder.CreateIndex(
                name: "role_created_by_idx",
                table: "role",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "role_organization_id_idx",
                table: "role",
                column: "organization_id");

            migrationBuilder.CreateIndex(
                name: "permission_id_idx",
                table: "role_permission",
                column: "permission_id");

            migrationBuilder.CreateIndex(
                name: "role_id_idx",
                table: "role_permission",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "role_permission_created_by_idx",
                table: "role_permission",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "specific_user_prmission_approved_by_idx",
                table: "specific_user_prmission",
                column: "approved_by");

            migrationBuilder.CreateIndex(
                name: "specific_user_prmission_content_id_idx",
                table: "specific_user_prmission",
                column: "content_id");

            migrationBuilder.CreateIndex(
                name: "specific_user_prmission_request_by_idx",
                table: "specific_user_prmission",
                column: "request_by");

            migrationBuilder.CreateIndex(
                name: "created_by_idx",
                table: "user_content",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "duplicated_from_idx",
                table: "user_content",
                column: "duplicated_from");

            migrationBuilder.CreateIndex(
                name: "organization_id_idx",
                table: "user_content",
                column: "organization_id");

            migrationBuilder.CreateIndex(
                name: "user_id_idx",
                table: "user_content",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "user_content_access_request_content_id_idx",
                table: "user_content_access_request",
                column: "content_id");

            migrationBuilder.CreateIndex(
                name: "user_content_access_request_requested_by_idx",
                table: "user_content_access_request",
                column: "request_by");

            migrationBuilder.CreateIndex(
                name: "attachments_created_by_idx",
                table: "user_content_attachments",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "user_content_id_idx",
                table: "user_content_attachments",
                column: "user_content_id");

            migrationBuilder.CreateIndex(
                name: "user_content_id_idx1",
                table: "user_content_meta",
                column: "content_id");

            migrationBuilder.CreateIndex(
                name: "user_content_question_created_by_idx",
                table: "user_content_question",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "user_content_question_user_content_id_idx",
                table: "user_content_question",
                column: "user_content_id");

            migrationBuilder.CreateIndex(
                name: "user_content_scratch_project_content_id_idx",
                table: "user_content_scratch_project",
                column: "user_content_id");

            migrationBuilder.CreateIndex(
                name: "user_content_scratch_project_created_by_idx",
                table: "user_content_scratch_project",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "permissions_user_content_id_idx",
                table: "user_content_sharing_permissions",
                column: "permissions_user_content_id");

            migrationBuilder.CreateIndex(
                name: "user_invite_created_by_idx",
                table: "user_invite",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "user_invite_organization_id_idx",
                table: "user_invite",
                column: "organization_id");

            migrationBuilder.CreateIndex(
                name: "user_invite_registered_user_id_idx",
                table: "user_invite",
                column: "registered_user_id");

            migrationBuilder.CreateIndex(
                name: "user_invite_role_id_idx",
                table: "user_invite",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "user_organization_created_by_idx",
                table: "user_organization",
                column: "cretaed_by");

            migrationBuilder.CreateIndex(
                name: "user_organization_organization_id_idx",
                table: "user_organization",
                column: "organization_id");

            migrationBuilder.CreateIndex(
                name: "user_organization_user_id_idx",
                table: "user_organization",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "user_organization_email_organization_id_idx",
                table: "user_organization_emails",
                column: "organization_id");

            migrationBuilder.CreateIndex(
                name: "user_organization_email_user_id_idx",
                table: "user_organization_emails",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "role_id_idx1",
                table: "user_organization_role",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "user_organization_id_idx",
                table: "user_organization_role",
                column: "user_organization_id");

            migrationBuilder.CreateIndex(
                name: "user_organization_role_created_by_idx",
                table: "user_organization_role",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "user_request_approved_by_idx",
                table: "user_request",
                column: "approved_by");

            migrationBuilder.CreateIndex(
                name: "user_request_organization_id_idx",
                table: "user_request",
                column: "organization_id");

            migrationBuilder.CreateIndex(
                name: "user_request_rejected_by_idx",
                table: "user_request",
                column: "rejected_by");

            migrationBuilder.CreateIndex(
                name: "user_request_role_id_idx",
                table: "user_request",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "user_request_user_id_idx",
                table: "user_request",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "username_login_student_created_by_idx",
                table: "username_login_student",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "username_login_student_link_parent_id_idx",
                table: "username_login_student",
                column: "link_parent_id");

            migrationBuilder.CreateIndex(
                name: "username_login_student_user_id_idx",
                table: "username_login_student",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "username_login_student_id_idx",
                table: "username_login_student_organization",
                column: "username_login_student_id");

            migrationBuilder.CreateIndex(
                name: "username_login_student_organization_organization_id_idx",
                table: "username_login_student_organization",
                column: "organization_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "admin");

            migrationBuilder.DropTable(
                name: "contact_us");

            migrationBuilder.DropTable(
                name: "course_lesson");

            migrationBuilder.DropTable(
                name: "course_schedule_attendance");

            migrationBuilder.DropTable(
                name: "course_schedule_members");

            migrationBuilder.DropTable(
                name: "on_going_class_for_user");

            migrationBuilder.DropTable(
                name: "organization_owner");

            migrationBuilder.DropTable(
                name: "organization_request");

            migrationBuilder.DropTable(
                name: "parent");

            migrationBuilder.DropTable(
                name: "parent_student");

            migrationBuilder.DropTable(
                name: "privillage");

            migrationBuilder.DropTable(
                name: "privillage_permission");

            migrationBuilder.DropTable(
                name: "role_permission");

            migrationBuilder.DropTable(
                name: "specific_user_prmission");

            migrationBuilder.DropTable(
                name: "student");

            migrationBuilder.DropTable(
                name: "teacher");

            migrationBuilder.DropTable(
                name: "user_content_access_request");

            migrationBuilder.DropTable(
                name: "user_content_attachments");

            migrationBuilder.DropTable(
                name: "user_content_meta");

            migrationBuilder.DropTable(
                name: "user_content_question");

            migrationBuilder.DropTable(
                name: "user_content_scratch_project");

            migrationBuilder.DropTable(
                name: "user_content_sharing_permissions");

            migrationBuilder.DropTable(
                name: "user_invite");

            migrationBuilder.DropTable(
                name: "user_organization_emails");

            migrationBuilder.DropTable(
                name: "user_organization_role");

            migrationBuilder.DropTable(
                name: "user_privillage");

            migrationBuilder.DropTable(
                name: "user_registration");

            migrationBuilder.DropTable(
                name: "user_request");

            migrationBuilder.DropTable(
                name: "username_login_student_organization");

            migrationBuilder.DropTable(
                name: "course_schedule_course_details");

            migrationBuilder.DropTable(
                name: "permission");

            migrationBuilder.DropTable(
                name: "user_organization");

            migrationBuilder.DropTable(
                name: "role");

            migrationBuilder.DropTable(
                name: "username_login_student");

            migrationBuilder.DropTable(
                name: "course_schedule");

            migrationBuilder.DropTable(
                name: "course_location");

            migrationBuilder.DropTable(
                name: "user_content");

            migrationBuilder.DropTable(
                name: "course");

            migrationBuilder.DropTable(
                name: "organization");

            migrationBuilder.DropTable(
                name: "user");
        }
    }
}
