const fetch = require('node-fetch2');

const fetchPRsStatus = async (owner, repo, authToken) => {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=all`;

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching PRs: ${response.statusText}`);
        }

        const pullRequests = await response.json();

        return pullRequests;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const owner = 'kulak91';
const repo = 'async';
const authToken = process.env.GITHUB_TOKEN;

fetchPRsStatus(owner, repo, authToken)
    .then(prsStatus => console.log(prsStatus))
    .catch(error => console.error('Failed to fetch PRs status:', error));
