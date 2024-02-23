const fetch = require('node-fetch2');

async function fetchPRDetailsWithRetry(url, headers, retries = 3, delay = 3000) {
  while (retries > 0) {
      const response = await fetch(url, { headers });
      if (!response.ok) {
          throw new Error(`Error fetching PR details: ${response.statusText}`);
      }

      const prDetails = await response.json();
      if (prDetails.mergeable !== null) {
          return prDetails; // Return as soon as mergeable status is available
      }

      retries--;
      console.log(`Waiting for mergeable status... Retries left: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, delay)); // Wait for a bit before retrying
  }

  throw new Error('Mergeable status could not be determined after retries.');
}

const fetchOpenPRsStatusWithRetry = async (owner, repo, authToken) => {
  // Rest of your function as before...

  for (const pr of pullRequests) {
      if (pr.draft) continue; // Skip drafts

      try {
          const prDetails = await fetchPRDetailsWithRetry(pr.url, { headers }, 3, 3000);
          console.log({
              number: pr.number,
              title: pr.title,
              state: pr.state,
              mergeable: prDetails.mergeable,
              merged: prDetails.merged,
              draft: prDetails.draft,
          });
      } catch (error) {
          console.error(`Failed to fetch mergeable status for PR #${pr.number}: ${error.message}`);
      }
  }

  console.log('Fetch completed.');
};


const owner = 'kulak91';
const repo = 'async';
const authToken = process.env.GITHUB_TOKEN;

fetchOpenPRsStatus(owner, repo, authToken)
    .then(() => console.log('fetch conpleted'))
    .catch(error => console.error('Failed to fetch PRs status:', error));
