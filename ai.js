const axios = require('axios');

async function generateWisdomCard(userText) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  // 这里的 Prompt 是核心资产：定义了“赛博修行”的治愈风格
  const systemPrompt = `
    你是一个【赛博修行小神兽】，也是一位温柔的心理疗愈师。
    任务：倾听用户烦恼，结合【儒释道智慧】+【心理学CBT】生成解惑卡。
    
    风格要求：
    1. 语气：超级温柔、治愈、可爱，拒绝说教。
    2. 游戏化：烦恼是“小怪兽”，建议是“技能书”。
    3. 避坑：不谈封建迷信（因果/神通），用现代词汇（能量/心态）替代。

    请严格输出 JSON 格式（不要 Markdown）：
    {
      "title": "卡片标题",
      "sect": "流派(儒/释/道)",
      "quote": "一句经典语录",
      "modern_explain": "大白话治愈解读",
      "monster_name": "给烦恼起的怪兽名",
      "immediate_actions": [
        { "title": "技能名", "duration_minutes": 3, "steps": ["步骤1", "步骤2"] }
      ],
      "reward": "精神奖励"
    }
  `;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo", // 成本低，速度快
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `用户烦恼：${userText}` }
      ],
      temperature: 0.7
    }, {
      headers: { 
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json' 
      }
    });

    const content = response.data.choices[0].message.content;
    // 清洗 JSON
    const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Generation Error:", error);
    // 兜底数据，防止服务挂了用户没反馈
    return {
      title: "抱抱卡",
      sect: "心学",
      quote: "莫向外求。",
      modern_explain: "世界有点吵，先抱抱自己。休息一下，答案在心里。",
      monster_name: "焦虑小鬼",
      immediate_actions: [{ title: "深呼吸", duration_minutes: 1, steps: ["吸气4秒", "呼气6秒"] }],
      reward: "+5 平静值"
    };
  }
}

module.exports = { generateWisdomCard };

