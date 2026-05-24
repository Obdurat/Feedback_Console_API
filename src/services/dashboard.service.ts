import prisma from "../config/prisma";

class DashboardService {
  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalActiveMembers,
      totalFeedbacksThisMonth,
      positiveFeedbacksThisMonth,
      improvementFeedbacksThisMonth,
      topSubmitter,
    ] = await Promise.all([
      prisma.teamMember.count({
        where: { status: "Active" },
      }),

      prisma.feedback.count({
        where: { createdAt: { gte: startOfMonth } },
      }),

      prisma.feedback.count({
        where: { type: "POSITIVE", createdAt: { gte: startOfMonth } },
      }),

      prisma.feedback.count({
        where: { type: "IMPROVEMENT", createdAt: { gte: startOfMonth } },
      }),

      prisma.feedback.groupBy({
        by: ["submittedById"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 1,
      }),
    ]);

    const topSubmitterMember = topSubmitter[0]
      ? await prisma.teamMember.findUnique({
          where: { id: topSubmitter[0].submittedById },
          select: { id: true, name: true },
        })
      : null;

    const positiveRatio =
      totalFeedbacksThisMonth > 0
        ? Math.round(
            (positiveFeedbacksThisMonth / totalFeedbacksThisMonth) * 100,
          )
        : 0;

    return {
      totalActiveMembers,
      totalFeedbacksThisMonth,
      positiveRatio,
      improvementRatio: 100 - positiveRatio,
      positiveFeedbacksThisMonth,
      improvementFeedbacksThisMonth,
      topSubmitter: topSubmitterMember
        ? { ...topSubmitterMember, count: topSubmitter[0]._count.id }
        : null,
    };
  }

  async getFeedbacksByCategory() {
    const results = await prisma.feedback.groupBy({
      by: ["category", "type"],
      _count: { id: true },
      orderBy: { category: "asc" },
    });

    // Shape into { category, POSITIVE, IMPROVEMENT }
    const map = new Map<
      string,
      { category: string; POSITIVE: number; IMPROVEMENT: number }
    >();

    for (const row of results) {
      if (!map.has(row.category)) {
        map.set(row.category, {
          category: row.category,
          POSITIVE: 0,
          IMPROVEMENT: 0,
        });
      }
      map.get(row.category)![row.type] = row._count.id;
    }

    return Array.from(map.values());
  }

  async getRecentFeedbacks() {
    return prisma.feedback.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        category: true,
        comment: true,
        createdAt: true,
        member: { select: { id: true, name: true } },
        submittedBy: { select: { id: true, name: true } },
      },
    });
  }

  async getTopMembersByFeedback() {
    const results = await prisma.feedback.groupBy({
      by: ["memberId", "type"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    const map = new Map<
      string,
      { memberId: string; POSITIVE: number; IMPROVEMENT: number; total: number }
    >();

    for (const row of results) {
      if (!map.has(row.memberId)) {
        map.set(row.memberId, {
          memberId: row.memberId,
          POSITIVE: 0,
          IMPROVEMENT: 0,
          total: 0,
        });
      }
      const entry = map.get(row.memberId)!;
      entry[row.type] = row._count.id;
      entry.total += row._count.id;
    }

    const sorted = Array.from(map.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const members = await prisma.teamMember.findMany({
      where: { id: { in: sorted.map((s) => s.memberId) } },
      select: { id: true, name: true, role: { select: { name: true } } },
    });

    return sorted.map((entry) => ({
      ...entry,
      member: members.find((m) => m.id === entry.memberId)!,
    }));
  }
}

export default new DashboardService();
