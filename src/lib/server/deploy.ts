/**
 * Starts a new site build through the Cloudflare Pages deploy hook.
 * The URL is a secret (anyone who has it can trigger builds), so it is never logged or returned.
 */
export async function triggerDeploy(hookUrl: string | undefined): Promise<"started" | "not_configured" | "failed"> {
    if (!hookUrl) return "not_configured";
    try {
        const response = await fetch(hookUrl, { method: "POST" });
        return response.ok ? "started" : "failed";
    } catch {
        return "failed";
    }
}
