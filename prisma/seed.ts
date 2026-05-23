import prisma from "../src/config/prisma";

async function main() {
  await prisma.feedback.deleteMany();

  await prisma.teamMember.deleteMany();

  const john = await prisma.teamMember.create({
    data: {
      name: "John Carter",

      position: "Customer Support Specialist",

      status: "Active",

      hiringDate: new Date("2025-09-12"),

      wave: 3,

      teamLead: "Anderson Rodrigues",

      teamManager: "Sarah Johnson",

      manager: "Michael Lee",

      director: "Emma Wilson",

      feedbacks: {
        create: [
          {
            type: "POSITIVE",

            category: "Performance",

            comment: "# Great Work\nExcellent SLA handling.",
          },

          {
            type: "IMPROVEMENT",

            category: "Communication",

            comment: "# Communication\nNeeds better escalation updates.",
          },
        ],
      },
    },
  });

  console.log(john);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
