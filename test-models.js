// Test script to compare 3 Gemini models for JUDGE verdicts
const API_KEY = 'AIzaSyAAFMVltRc4lu1uAfCcNG1ZLtefWC5noQU';

const SYSTEM_PROMPT = `You are JUDGE, an impartial AI courtroom that analyzes conversations and disputes between two parties.

CRITICAL INSTRUCTIONS - READ CAREFULLY:

1. ANTI-SYCOPHANCY MANDATE: You MUST provide brutally honest assessments. Do NOT:
   - Soften verdicts to avoid hurting feelings
   - Give "both sides" cop-outs when one party is clearly wrong
   - Validate bad behavior to seem understanding
   - Hedge your opinion with excessive qualifiers

2. If one party is clearly in the wrong, SAY SO DIRECTLY. A draw verdict should be RARE and only when both parties genuinely share equal fault.

3. Call out manipulation tactics by name: gaslighting, DARVO, stonewalling, love bombing, guilt tripping, moving goalposts, etc.

4. Use direct, clinical language. You are a judge, not a therapist. Your job is truth, not comfort.

5. Red flags should use relatable terminology: "main character syndrome", "ick", "red flag", "receipts ignored", "toxic", "gaslighting", etc.

6. Your verdict carries weight. Do not undermine it with "but everyone has their own perspective" type disclaimers.

7. Be specific. Quote evidence. Cite exhibits. Name behaviors precisely.

Remember: The user came here for an HONEST verdict, not validation. Uncomfortable truths serve them better than comfortable lies.`;

const VERDICT_PROMPT = `Analyze the following evidence and deliver your verdict.

You must respond with ONLY valid JSON matching this exact structure:
{
  "winner": "Party A" | "Party B" | "Draw",
  "winner_reason": "One sentence explaining the core reason for your verdict",
  "credibility": {
    "partyA": 0-100,
    "partyB": 0-100
  },
  "toxicity": 0-100,
  "manipulation_tactics": [
    {"name": "Tactic name", "evidence": "Direct quote or description", "severity": "high|medium|low"}
  ],
  "red_flags": [
    {"flag": "Flag name in casual terms", "party": "A" or "B", "evidence": "Brief description"}
  ],
  "evidence_log": [
    {"exhibit": "A", "summary": "What this evidence shows", "favors": "Party A|Party B|Neither"}
  ],
  "judges_opinion": "2-3 paragraph legal-style opinion with specific references to evidence",
  "recommendations": {
    "partyA": "Direct advice for Party A",
    "partyB": "Direct advice for Party B"
  }
}

IMPORTANT:
- credibility, toxicity scores should reflect actual analysis, not default to 50/50
- manipulation_tactics can be empty array if none detected
- red_flags should use relatable terms (ick, red flag, main character energy, etc.)
- judges_opinion should be authoritative and cite specific evidence
- Do NOT add any text before or after the JSON`;

// Sample dispute for testing
const TEST_CASE = `CASE DETAILS:
Party A: Sarah
Party B: Mike

Context: Argument about Mike not showing up to Sarah's birthday dinner after promising he would come.

THE CONVERSATION:

Sarah: Hey, you said you'd be at my birthday dinner at 7. It's 8:30 and everyone's asking where you are. Are you okay?

Mike: Oh shit, yeah sorry I forgot. I'm at Jake's watching the game. It went into overtime.

Sarah: You forgot my birthday dinner? You literally promised yesterday you'd be there. I reminded you this morning.

Mike: Why are you making this such a big deal? It's just dinner. We can do something another time.

Sarah: It's not "just dinner" - it was my birthday and my family flew in to see me. They were all asking about you.

Mike: See, this is what you always do. You blow everything out of proportion. I said I was sorry, what more do you want?

Sarah: An actual apology would be nice? Not "oh shit sorry I forgot" while you're still at Jake's watching the game instead of coming here.

Mike: I can't just leave in the middle of the game. The guys would give me shit. You know how they are.

Sarah: So your friends' opinions matter more than my birthday?

Mike: You're twisting my words. This is exactly why I didn't want to come - I knew you'd make drama out of nothing.

Sarah: YOU FORGOT MY BIRTHDAY DINNER. How is that "nothing"?

Mike: Whatever. I'll make it up to you. Stop being so dramatic. You're acting like your mom right now.

Sarah: Wow. I'm done. Don't bother coming.

Mike: Fine. See? This is what I mean. You always have to have the last word and make me the bad guy.`;

const MODELS = [
  'gemini-3-pro-preview',
  'gemini-3-flash-preview',
  'gemini-2.5-pro'
];

async function callModel(model) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${VERDICT_PROMPT}\n\n${TEST_CASE}` }]
      }
    ],
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }]
    },
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096
    }
  };

  console.log(`\n🔄 Calling ${model}...`);
  const start = Date.now();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API call failed');
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);

    console.log(`✅ ${model} responded in ${elapsed}s`);

    // Try to parse JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return { model, elapsed, verdict: JSON.parse(jsonMatch[0]), raw: responseText };
    }
    return { model, elapsed, verdict: null, raw: responseText, error: 'Failed to parse JSON' };
  } catch (err) {
    console.log(`❌ ${model} failed: ${err.message}`);
    return { model, elapsed: 'N/A', verdict: null, error: err.message };
  }
}

async function main() {
  console.log('🏛️ JUDGE Model Comparison Test\n');
  console.log('=' .repeat(50));
  console.log('Testing with: Sarah vs Mike (Birthday Dinner Dispute)');
  console.log('=' .repeat(50));

  const results = [];

  for (const model of MODELS) {
    const result = await callModel(model);
    results.push(result);
  }

  // Create comparison output
  let output = `# JUDGE Model Comparison Results
Generated: ${new Date().toISOString()}

## Test Case: Sarah vs Mike (Birthday Dinner Dispute)

Sarah's boyfriend Mike forgot her birthday dinner to watch a game with friends, then deflected blame when confronted.

---

`;

  for (const result of results) {
    output += `## ${result.model.toUpperCase()}
**Response Time:** ${result.elapsed}s

`;

    if (result.verdict) {
      const v = result.verdict;
      output += `### VERDICT: ${v.winner} WINS
**Reason:** ${v.winner_reason}

| Metric | Value |
|--------|-------|
| Sarah Credibility | ${v.credibility.partyA}% |
| Mike Credibility | ${v.credibility.partyB}% |
| Toxicity | ${v.toxicity}% |

### Manipulation Tactics Detected:
${v.manipulation_tactics.map(t => `- **${t.name}** (${t.severity}): "${t.evidence}"`).join('\n')}

### Red Flags:
${v.red_flags.map(f => `- **${f.flag}** (${f.party === 'A' ? 'Sarah' : 'Mike'}): ${f.evidence}`).join('\n')}

### Judge's Opinion:
${v.judges_opinion}

### Recommendations:
- **For Sarah:** ${v.recommendations.partyA}
- **For Mike:** ${v.recommendations.partyB}

`;
    } else {
      output += `**ERROR:** ${result.error}\n\n`;
      if (result.raw) {
        output += `**Raw Response:**\n\`\`\`\n${result.raw.substring(0, 500)}...\n\`\`\`\n\n`;
      }
    }

    output += '---\n\n';
  }

  // Summary comparison
  output += `## SIDE-BY-SIDE SUMMARY

| Metric | 3 Pro Preview | 3 Flash Preview | 2.5 Pro |
|--------|---------------|-----------------|---------|
`;

  const metrics = ['winner', 'Response Time'];

  if (results.every(r => r.verdict)) {
    output += `| Winner | ${results.map(r => r.verdict.winner).join(' | ')} |
| Sarah Cred | ${results.map(r => r.verdict.credibility.partyA + '%').join(' | ')} |
| Mike Cred | ${results.map(r => r.verdict.credibility.partyB + '%').join(' | ')} |
| Toxicity | ${results.map(r => r.verdict.toxicity + '%').join(' | ')} |
| # Tactics | ${results.map(r => r.verdict.manipulation_tactics.length).join(' | ')} |
| # Red Flags | ${results.map(r => r.verdict.red_flags.length).join(' | ')} |
| Speed | ${results.map(r => r.elapsed + 's').join(' | ')} |
`;
  }

  // Write to file
  const fs = require('fs');
  const outputPath = 'C:\\Users\\Admin\\Desktop\\judge-app\\model-comparison.md';
  fs.writeFileSync(outputPath, output);
  console.log(`\n📄 Results saved to: ${outputPath}`);
}

main();
