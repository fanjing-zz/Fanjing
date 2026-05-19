export interface ChatMsg { id: number; role: 'user' | 'agent'; text: string; }

export function getAgentResponse(input: string): string {
  const q = input.toLowerCase();

  if (/launch|发布|上线|go live|submit/.test(q))
    return "Launch sequence confirmed. Submitting 74 ads to Meta Ads API — transitioning PAUSED → ACTIVE now. ETA ~45s. Any policy rejections will surface immediately.";

  if (/status|状态|how.*(going|are)|check/.test(q))
    return "Status snapshot: 74 ads PAUSED · 5 campaigns · $148/day budget idle · Pipeline 100% healthy · No anomalies in last 24h signal window.";

  if (/roas|roi|return|performance|result/.test(q))
    return "ROAS tracking 13.0× vs 20× target. Harmonic-2 waveform stable. Note: LNB-0120 (Data-Stream) still in RECOVERY — recommend review before activation.";

  if (/pause|stop|暂停|hold|cancel|kill/.test(q))
    return "All 74 ads confirmed PAUSED. Zero active spend. Pipeline locked — awaiting your go-signal.";

  if (/budget|预算|spend|cost|money/.test(q))
    return "Budget: $2/ad set × 74 ad sets = $148/day max. Billing: IMPRESSIONS. Current utilization: $0.00 — all paused.";

  if (/target|audience|受众|人群|demo|who/.test(q))
    return "Targeting: female · 25–60 · US / CA / GB / AU · Optimization: OFFSITE_CONVERSIONS · Bid: LOWEST_COST_WITHOUT_CAP · Est. reach 42M.";

  if (/copy|creative|素材|文案|asset|image/.test(q))
    return "74 creatives built: 5 books × up to 15 variants · avg 505-word EN ad body · 1080×1080 format · all cleared Meta content policy check.";

  if (/pixel|tracking|track|signal/.test(q))
    return "Pixel 88348206787787853 tracking PURCHASE events. Data-tracking ID: 8834 8266 7767 853. All signals nominal — no data gaps.";

  if (/report|总结|summary|recap|log/.test(q))
    return "Run recap: Feishu pull → ETL validate → copy gen → creative build → Meta submit. 5 campaigns · 74 ad sets · 74 ads. All PAUSED pending your approval.";

  if (/campaign|广告系列|account/.test(q))
    return "5 campaigns created under Meta Ad Account 8048 9042 9093 816. Objective: OUTCOME_SALES. Pixel attached to all ad sets.";

  if (/book|drama|story|content/.test(q))
    return "5 short drama titles processed from the Feishu booklist. Each has a dedicated creative bundle: cover image + ~500-word EN ad body + headline.";

  if (/help|帮|what can|how|如何/.test(q))
    return "I can launch ads, pause campaigns, pull status reports, explain targeting, surface ROAS data, or answer questions about the current pipeline. What do you need?";

  return "Understood. All systems nominal — pipeline at 100% capacity. Anything specific you'd like me to action?";
}
