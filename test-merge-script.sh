#!/bin/bash

# Create test-1 branch and add 3 commits
git checkout -b test-1

# First commit
echo "Test change 1" >> test-file.txt
git add test-file.txt
git commit -m "Add test change 1"

# Second commit
echo "Test change 2" >> test-file.txt
git add test-file.txt
git commit -m "Add test change 2"

# Third commit
echo "Test change 3" >> test-file.txt
git add test-file.txt
git commit -m "Add test change 3"

# Push the branch
git push -u origin test-1

# Create PR to weekly branch
gh pr create --title "Test PR for merge testing" --body "Test PR to test merge commit detection" --base weekly --head test-1

# Get the PR number
PR_NUMBER=$(gh pr list --head test-1 --json number --jq '.[0].number')

# Merge the PR
gh pr merge $PR_NUMBER --merge --delete-branch

echo "Done! PR #$PR_NUMBER has been merged into weekly branch"