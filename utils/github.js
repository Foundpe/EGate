import fetch from "node-fetch";

const TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || "main";

const headers = {
  Authorization: `token ${TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

export async function getKeys() {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/keys.json?ref=${BRANCH}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch keys.json (${res.status})`);
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content: JSON.parse(content), sha: data.sha };
}

export async function updateKeys(newKeys, sha) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/keys.json`;
  const message = "Update keys.json via API";

  const body = {
    message,
    content: Buffer.from(JSON.stringify(newKeys, null, 2)).toString("base64"),
    sha,
    branch: BRANCH,
  };

  const res = await fetch(url, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to update keys.json: ${err}`);
  }

  return await res.json();
}


export async function getFileFromGitHub(filename) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filename}?ref=${BRANCH}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch ${filename} (${res.status})`);
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content, sha: data.sha };
}
