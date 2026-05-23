import prisma from "../src/config/prisma";

const feedbackCategories = [
  "Communication",
  "Performance",
  "Attendance",
  "Teamwork",
  "Technical Skills",
  "Customer Handling",
];

const positiveComments = [
  "# Excellent Performance\nHandled customer escalations professionally.",
  "# Strong Teamwork\nHelped peers during high volume periods.",
  "# SLA Success\nMaintained excellent SLA metrics this month.",
  "# Great Initiative\nTook ownership of critical incidents.",
];

const improvementComments = [
  "# Communication Improvement\nNeeds more proactive updates.",
  "# Attendance Concern\nSome recent late logins were noticed.",
  "# Documentation\nTicket notes could be more detailed.",
  "# Escalation Process\nShould escalate blockers sooner.",
];

async function main() {
  // Cleanup
  await prisma.feedback.deleteMany();

  await prisma.teamMember.deleteMany();

  await prisma.role.deleteMany();

  // =========================================================
  // ROLES
  // =========================================================

  const directorRole = await prisma.role.create({
    data: {
      name: "Director",
    },
  });

  const managerRole = await prisma.role.create({
    data: {
      name: "Manager",
    },
  });

  const teamManagerRole = await prisma.role.create({
    data: {
      name: "Team Manager",
    },
  });

  const teamLeadRole = await prisma.role.create({
    data: {
      name: "Team Lead",
    },
  });

  const agentRole = await prisma.role.create({
    data: {
      name: "Customer Support Specialist",
    },
  });

  // =========================================================
  // HIERARCHY
  // =========================================================

  const director = await prisma.teamMember.create({
    data: {
      name: "Emma Wilson",

      status: "Active",

      hiringDate: new Date("2018-01-10"),

      wave: 0,

      roleId: directorRole.id,
    },
  });

  const manager = await prisma.teamMember.create({
    data: {
      name: "Michael Lee",

      status: "Active",

      hiringDate: new Date("2019-03-15"),

      wave: 0,

      roleId: managerRole.id,

      reportsToId: director.id,
    },
  });

  const teamManager = await prisma.teamMember.create({
    data: {
      name: "Sarah Johnson",

      status: "Active",

      hiringDate: new Date("2020-05-12"),

      wave: 0,

      roleId: teamManagerRole.id,

      reportsToId: manager.id,
    },
  });

  const teamLead = await prisma.teamMember.create({
    data: {
      name: "Anderson Rodrigues",

      status: "Active",

      hiringDate: new Date("2021-08-22"),

      wave: 0,

      roleId: teamLeadRole.id,

      reportsToId: teamManager.id,
    },
  });

  // =========================================================
  // AGENTS
  // =========================================================

  const agentNames = [
    "John Carter",
    "Alice Johnson",
    "Michael Brown",
    "Emily Davis",
    "Sophia Martinez",
    "Daniel Wilson",
    "Olivia Taylor",
    "James Anderson",
    "Emma Thomas",
    "William Jackson",
    "Isabella White",
    "Benjamin Harris",
    "Lucas Martin",
    "Charlotte Thompson",
    "Henry Moore",
  ];

  for (const [index, name] of agentNames.entries()) {
    const agent = await prisma.teamMember.create({
      data: {
        name,

        status: index % 4 === 0 ? "Inactive" : "Active",

        hiringDate: new Date(2023, index % 12, (index + 1) * 2),

        wave: (index % 5) + 1,

        roleId: agentRole.id,

        reportsToId: teamLead.id,
      },
    });

    const feedbackCount = Math.floor(Math.random() * 6);

    for (let i = 0; i < feedbackCount; i++) {
      const isPositive = Math.random() > 0.4;

      const possibleSubmitters = [teamLead.id, teamManager.id, manager.id];

      const randomSubmitter =
        possibleSubmitters[
          Math.floor(Math.random() * possibleSubmitters.length)
        ];

      await prisma.feedback.create({
        data: {
          type: isPositive ? "POSITIVE" : "IMPROVEMENT",

          category:
            feedbackCategories[
              Math.floor(Math.random() * feedbackCategories.length)
            ],

          comment: isPositive
            ? positiveComments[
                Math.floor(Math.random() * positiveComments.length)
              ]
            : improvementComments[
                Math.floor(Math.random() * improvementComments.length)
              ],

          createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24 * 7),

          memberId: agent.id,

          submittedById: randomSubmitter,
        },
      });
    }
  }

  console.log("Seed completed successfully.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
