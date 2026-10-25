const entities = {
  amp: "&",
  nbsp: " ",
  "#39": "'",
  quot: "\"",
  lt: "<",
  gt: ">",
  rsquo: "’",
  ndash: "–",
};

export function htmlToLines(html) {
  const text = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|noscript|svg)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<(script|style|noscript|svg)\b[^>]*>[\s\S]*$/gi, " ")
    .replace(/<\/?(?:p|div|li|h[1-6]|br|tr|td|section|article)\b[^>]*>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(amp|nbsp|#39|quot|lt|gt|rsquo|ndash);/gi, (entity) => entities[entity.slice(1, -1).toLowerCase()] ?? entity)
    .replace(/\r\n?/g, "\n");
  const seen = new Set();
  return text.split("\n").map((line) => line.replace(/\s+/gu, " ").trim()).filter((line) => {
    const noise = line.length > 40 && (!line.includes(" ") || /^(?:request unsuccessful|access denied|service unavailable)\b/i.test(line));
    if (line.length < 12 || !/\p{L}/u.test(line) || noise || seen.has(line)) return false;
    seen.add(line);
    return true;
  });
}

export function diffLines(prev, next) {
  const difference = (from, against) => {
    const blocked = new Set(against);
    const seen = new Set();
    return from.filter((line) => {
      if (blocked.has(line) || seen.has(line)) return false;
      seen.add(line);
      return true;
    });
  };
  return { added: difference(next, prev), removed: difference(prev, next) };
}

export function districtTerms(towns) {
  const rows = Array.isArray(towns) ? towns : towns.towns;
  const names = rows.map(({ name }) => name.replace(/\s+(Township|Borough|City)$/i, "").trim());
  return [...new Set([...names, "Mercer", "Middlesex", "Somerset"])];
}

export function isHit(line, terms) {
  const hasDistrict = terms.some((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i").test(line);
  });
  const hasKeyword = /\b(?:accepting|applications?|apply|deadline|lotter(?:y|ies)|waiting\s+lists?|waitlist|preliminary|rentals?|for\s+sale|affordable)\b/i.test(line);
  return hasDistrict && hasKeyword;
}

export function staleListings(listings, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const oldEnough = now.getTime() - 30 * 24 * 60 * 60 * 1000;
  return listings.filter((listing) => {
    const deadline = listing.deadline ? new Date(`${listing.deadline}T00:00:00`) : null;
    const deadlinePassed = ["open", "closing"].includes(listing.status) && deadline !== null && !Number.isNaN(deadline.getTime()) && deadline < today;
    const checked = new Date(`${listing.lastChecked}T00:00:00`);
    const notCheckedRecently = !Number.isNaN(checked.getTime()) && checked.getTime() < oldEnough;
    return deadlinePassed || notCheckedRecently;
  });
}

export function buildReport(results, stale, date) {
  const addedLines = results.some((result) => result.added?.length);
  const changedFiles = results.filter((result) => result.kind === "file" && result.changed);
  if (!addedLines && changedFiles.length === 0 && stale.length === 0) return null;

  const hits = results.filter((result) => result.hits?.length);
  const otherChanges = results.filter((result) => result.kind === "html" && result.added?.length && !result.hits?.length);
  const failures = results.filter((result) => result.error);
  const lines = [`# Lottery watch — ${date}`, "", "## Possible new or changed NJ-12 lotteries"];
  if (hits.length) {
    for (const result of hits) {
      lines.push("", `### [${result.label}](${result.url})`);
      for (const line of result.hits) lines.push(`- ${line}`);
    }
  } else {
    lines.push("", "No likely NJ-12 lottery changes detected.");
  }

  lines.push("", "## Other changed pages");
  if (otherChanges.length) {
    for (const result of otherChanges) {
      lines.push("", `- [${result.label}](${result.url}) — ${result.added.length} added / ${result.removed?.length ?? 0} removed lines`);
      for (const line of result.added.slice(0, 5)) lines.push(`  - ${line}`);
    }
  } else {
    lines.push("", "No other changed pages.");
  }

  lines.push("", "## Changed files");
  if (changedFiles.length) {
    for (const result of changedFiles) lines.push(`- [${result.label}](${result.url}) — SHA-256 changed`);
  } else {
    lines.push("", "No changed files.");
  }

  lines.push("", "## Needs a data update");
  if (stale.length) {
    for (const listing of stale) {
      lines.push(`- **${listing.name}** (${listing.town}) — status: \`${listing.status}\`; deadline: ${listing.deadline ?? "none"}; last checked: ${listing.lastChecked}.`);
    }
  } else {
    lines.push("", "No stale listings.");
  }

  lines.push("", "## Couldn't fetch");
  if (failures.length) {
    for (const result of failures) lines.push(`- [${result.label}](${result.url}) — ${result.error}`);
  } else {
    lines.push("", "All sources fetched.");
  }
  return lines.join("\n");
}
