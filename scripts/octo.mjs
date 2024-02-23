import { Octokit, App } from "octokit";

const API_TOKEN = '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';
const owner = 'kulak91';
const repo = 'async';
const octokit = new Octokit({
  auth: API_TOKEN
});

const LABEL_NAME = 'merge conflicts';

const managePRLabels = async (owner, repo) => {
  const prs = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
    owner,
    repo,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    },
    state: 'open',
  });

  for (const pr of prs.data) {
    const prDetails = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
      owner,
      repo,
      pull_number: pr.number
    });

    const hasMergeConflictsLabel = prDetails.data.labels.some(label => label.name === LABEL_NAME);

    if (prDetails.data.mergeable_state === "dirty" && !hasMergeConflictsLabel) {
      // Add "merge conflicts" label
      await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/labels', {
        owner,
        repo,
        issue_number: pr.number,
        labels: [LABEL_NAME]
      });
      console.log(`Added "merge conflicts" label to PR #${pr.number}`);
    } else if (prDetails.data.mergeable_state !== "dirty" && hasMergeConflictsLabel) {
      // Remove "merge conflicts" label
      await octokit.request('DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}', {
        owner,
        repo,
        issue_number: pr.number,
        name: LABEL_NAME
      });
      console.log(`Removed "merge conflicts" label from PR #${pr.number}`);
    }
  }
};
managePRLabels(owner, repo).catch(console.error);
