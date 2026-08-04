import { budgetConfig, BudgetConfig } from "./budget.config";

export async function fetchProposalBySlug(slug: string): Promise<BudgetConfig> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jikehjpiehubhbesniry.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_DPPS_TaRPQjUgFlK9iH7Iw_XTK6kWAn";

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/proposals?slug=eq.${encodeURIComponent(slug)}&select=*`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.warn(`[CarMiDev Proposal] Supabase returned status ${res.status}. Falling back to local budget.config.ts`);
      return budgetConfig;
    }

    const data = await res.json();
    if (!data || data.length === 0) {
      console.warn(`[CarMiDev Proposal] Proposal with slug "${slug}" not found in Supabase. Falling back to local budget.config.ts`);
      return budgetConfig;
    }

    const item = data[0];

    return {
      ...budgetConfig,
      clientName: item.client_name || budgetConfig.clientName,
      clientSubtitle: item.client_subtitle || budgetConfig.clientSubtitle,
      projectName: item.project_name || budgetConfig.projectName,
      heroTagline: item.hero_tagline || budgetConfig.heroTagline,
      heroDescription: item.hero_description || budgetConfig.heroDescription,
      whatsappPhone: item.whatsapp_phone || budgetConfig.whatsappPhone,
      valueBadges: Array.isArray(item.value_badges) && item.value_badges.length > 0 ? item.value_badges : budgetConfig.valueBadges,
      plans: item.plan_core || item.plan_momentum || item.plan_alacarta ? {
        core: item.plan_core || budgetConfig.plans.core,
        momentum: item.plan_momentum || budgetConfig.plans.momentum,
        alacarta: item.plan_alacarta || budgetConfig.plans.alacarta,
      } : budgetConfig.plans,
      tableData: item.table_data || budgetConfig.tableData,
    };
  } catch (error) {
    console.error("[CarMiDev Proposal] Error fetching proposal from Supabase:", error);
    return budgetConfig;
  }
}
