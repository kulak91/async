const fetch = require('node-fetch2');

const fetchOpenPRsStatus = async (owner, repo, authToken) => {
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}/pulls`;
  const params = new URLSearchParams({ state: 'open' }); // Fetch only open PRs
  const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Accept': 'application/vnd.github.v3+json',
  };

  try {
      const response = await fetch(`${baseUrl}?${params.toString()}`, { headers });
      if (!response.ok) {
          throw new Error(`Error fetching PRs: ${response.statusText}`);
      }

      const pullRequests = await response.json();
      for (const pr of pullRequests) {
          if (pr.draft) {
              // Skip draft PRs if you only want non-draft open PRs
              continue;
          }
          // Fetch additional details for each PR, including the `mergeable` status
          const prDetailsResponse = await fetch(pr.url, { headers });
          if (!prDetailsResponse.ok) {
              throw new Error(`Error fetching PR details: ${prDetailsResponse.statusText}`);
          }
          const prDetails = await prDetailsResponse.json();

          // Print out PR details, including the `mergeable` status
          console.log({
              number: pr.number,
              title: pr.title,
              state: pr.state,
              mergeable: prDetails.mergeable,
              merged: prDetails.merged,
              draft: prDetails.draft,
          });
      }
  } catch (error) {
      console.error(error);
  }
};

const owner = 'kulak91';
const repo = 'async';
const authToken = process.env.GITHUB_TOKEN;

fetchOpenPRsStatus(owner, repo, authToken)
    .then(() => console.log('fetch conpleted'))
    .catch(error => console.error('Failed to fetch PRs status:', error));
