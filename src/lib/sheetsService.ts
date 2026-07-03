import { TopicItem, PostPerformance } from "../types";

export class SheetsService {
  /**
   * Creates a new Google Spreadsheet named "Social Media Automation Dashboard"
   * with two pre-configured sheets: "Topics" and "Analytics".
   */
  static async createSpreadsheet(accessToken: string): Promise<string> {
    const url = "https://sheets.googleapis.com/v4/spreadsheets";
    const body = {
      properties: {
        title: "Social Media Automation Dashboard 🚀",
      },
      sheets: [
        {
          properties: {
            title: "Topics",
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
        {
          properties: {
            title: "Analytics",
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to create spreadsheet: ${errText}`);
    }

    const data = await res.json();
    const spreadsheetId = data.spreadsheetId;

    if (!spreadsheetId) {
      throw new Error("No spreadsheetId returned from Sheets API");
    }

    // Now write headers to both sheets
    await this.initializeHeaders(accessToken, spreadsheetId);

    return spreadsheetId;
  }

  /**
   * Initializes row 1 headers in the "Topics" and "Analytics" sheets.
   */
  private static async initializeHeaders(accessToken: string, spreadsheetId: string): Promise<void> {
    const topicHeaders = [["ID", "Topic", "Category", "Status", "Scheduled Time", "Caption", "Image URL", "Hashtags"]];
    const analyticsHeaders = [
      ["Post ID", "Date", "Platform", "Caption", "Image URL", "Likes", "Shares", "Comments", "Clicks", "Engagement Rate %"]
    ];

    // Write Topic Headers
    await this.updateRange(accessToken, spreadsheetId, "Topics!A1:H1", topicHeaders);

    // Write Analytics Headers
    await this.updateRange(accessToken, spreadsheetId, "Analytics!A1:J1", analyticsHeaders);

    // Seed some initial demo topics so the sheet has immediate sample data
    const sampleTopics = [
      ["T-1", "Introduction to AI Agents in SaaS", "Technology", "Draft", "2026-07-04 10:00 AM", "", "", ""],
      ["T-2", "How to optimize your remote workspace productivity", "Lifestyle", "Draft", "2026-07-05 02:00 PM", "", "", ""],
      ["T-3", "5 Key metrics to track on social media campaigns", "Marketing", "Draft", "2026-07-06 09:00 AM", "", "", ""]
    ];
    await this.updateRange(accessToken, spreadsheetId, "Topics!A2:H4", sampleTopics);

    // Seed some demo post analytics for immediate rich dashboard visuals
    const sampleAnalytics = [
      ["P-101", "2026-06-15", "Facebook", "Unleashing the power of social automation. Streamline your workflow now!", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200", "125", "42", "18", "88", "8.2"],
      ["P-102", "2026-06-18", "Instagram", "Workspace aesthetics: key to deep work. Let's design a distraction-free desk.", "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200", "284", "15", "45", "110", "12.4"],
      ["P-103", "2026-06-22", "LinkedIn", "Why collaborative workspaces yield 3x innovation rate. Data shows diverse teams thrive.", "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200", "98", "31", "12", "54", "6.8"],
      ["P-104", "2026-06-25", "LinkedIn", "Top 5 digital marketing metrics you are ignoring in Q3.", "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200", "142", "27", "21", "76", "7.5"],
      ["P-105", "2026-06-28", "Instagram", "SaaS automation isn't coming; it's already here. Simplify the repetitive to focus on creativity.", "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200", "210", "8", "38", "94", "10.1"]
    ];
    await this.updateRange(accessToken, spreadsheetId, "Analytics!A2:J6", sampleAnalytics);
  }

  /**
   * Helper to write values in a specific range.
   */
  static async updateRange(
    accessToken: string,
    spreadsheetId: string,
    range: string,
    values: any[][]
  ): Promise<void> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=RAW`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to update range ${range}: ${errText}`);
    }
  }

  /**
   * Fetches topics from the "Topics" sheet.
   */
  static async fetchTopics(accessToken: string, spreadsheetId: string): Promise<TopicItem[]> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Topics!A2:H100`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to fetch topics from sheet: ${errText}`);
    }

    const data = await res.json();
    const rows: any[][] = data.values || [];

    return rows.map((row) => {
      let hashtags: string[] = [];
      if (row[7]) {
        try {
          if (row[7].startsWith("[")) {
            hashtags = JSON.parse(row[7]);
          } else {
            hashtags = row[7].split(",").map((t: string) => t.trim());
          }
        } catch {
          hashtags = row[7].split(" ").filter((t: string) => t.trim());
        }
      }

      return {
        id: row[0] || `T-${Math.floor(Math.random() * 10000)}`,
        topic: row[1] || "",
        category: row[2] || "General",
        status: (row[3] as "Draft" | "Scheduled" | "Posted") || "Draft",
        scheduledTime: row[4] || "",
        caption: row[5] || "",
        imageUrl: row[6] || "",
        hashtags: hashtags,
      };
    });
  }

  /**
   * Syncs (overwrites) the entire topics list in the "Topics" sheet to ensure consistency.
   */
  static async syncTopics(accessToken: string, spreadsheetId: string, topics: TopicItem[]): Promise<void> {
    // 1. Clear the old rows (up to row 100 to avoid leaving leftover rows)
    const clearUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Topics!A2:H100:clear`;
    await fetch(clearUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (topics.length === 0) return;

    // 2. Prepare values to write
    const values = topics.map((t) => [
      t.id,
      t.topic,
      t.category,
      t.status,
      t.scheduledTime,
      t.caption || "",
      t.imageUrl || "",
      t.hashtags ? JSON.stringify(t.hashtags) : "",
    ]);

    // 3. Write new values starting from row 2
    const range = `Topics!A2:H${topics.length + 1}`;
    await this.updateRange(accessToken, spreadsheetId, range, values);
  }

  /**
   * Fetches performance analytics from the "Analytics" sheet.
   */
  static async fetchAnalytics(accessToken: string, spreadsheetId: string): Promise<PostPerformance[]> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Analytics!A2:J100`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to fetch analytics from sheet: ${errText}`);
    }

    const data = await res.json();
    const rows: any[][] = data.values || [];

    return rows.map((row) => ({
      postId: row[0] || `P-${Math.floor(Math.random() * 1000)}`,
      date: row[1] || new Date().toISOString().split("T")[0],
      platform: (row[2] as "Facebook" | "Instagram" | "LinkedIn") || "Instagram",
      caption: row[3] || "",
      imageUrl: row[4] || "",
      likes: parseInt(row[5], 10) || 0,
      shares: parseInt(row[6], 10) || 0,
      comments: parseInt(row[7], 10) || 0,
      clicks: parseInt(row[8], 10) || 0,
      engagementRate: parseFloat(row[9]) || 0.0,
    }));
  }

  /**
   * Appends a new post performance analytics record to the "Analytics" sheet.
   */
  static async appendAnalytic(
    accessToken: string,
    spreadsheetId: string,
    item: PostPerformance
  ): Promise<void> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Analytics!A:J:append?valueInputOption=RAW`;

    const body = {
      values: [
        [
          item.postId,
          item.date,
          item.platform,
          item.caption,
          item.imageUrl,
          item.likes.toString(),
          item.shares.toString(),
          item.comments.toString(),
          item.clicks.toString(),
          item.engagementRate.toString(),
        ],
      ],
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to append analytic to sheet: ${errText}`);
    }
  }
}
