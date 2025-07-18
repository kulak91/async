#!/bin/bash
set -e

echo "🛠  Creating test branches and commits..."

git checkout buffer
git pull origin buffer

for i in {1..3}; do
  BRANCH_NAME="feature-test-$i"
  echo "🧹 Deleting old remote branch $BRANCH_NAME if exists"
  git push origin --delete $BRANCH_NAME 2>/dev/null || true
  git branch -D $BRANCH_NAME 2>/dev/null || true

  echo "🔀 Creating branch $BRANCH_NAME from buffer"
  git checkout -b $BRANCH_NAME buffer

  for j in {1..3}; do
    TIME=$(date +"%H:%M")
    echo "commit $i.$j" >> "testfile-$i.txt"
    git add .
    git commit -m "feat($BRANCH_NAME): add commit $i.$j [$TIME]"
  done

  echo "🚀 Pushing $BRANCH_NAME"
  git push origin $BRANCH_NAME

  echo "🔁 Simulating PR and squash merge of $BRANCH_NAME into buffer"
  git checkout buffer
  git merge --squash $BRANCH_NAME
  TIME=$(date +"%H:%M")
  git commit -m "merge($BRANCH_NAME): squash merged commits from $BRANCH_NAME [$TIME]"
  git branch -D $BRANCH_NAME
done

# echo "💥 Simulating failed deploy"
# TIME=$(date +"%H:%M")
# echo "fail test" >> should-fail.txt
# git add should-fail.txt
# git commit -m "test(buffer): add should-fail.txt (simulate failed deploy) [$TIME]"
git push origin buffer

echo "🛠  Merging buffer into dev..."
git checkout dev
git pull origin dev
TIME=$(date +"%H:%M")
git merge buffer -m "merge(buffer): merge all feature branches and test failure [$TIME]"
git push origin dev

echo "📜 Generating local changelog between last ref and HEAD..."

LAST_REF_FILE="last_failed_before_ref.txt"
CURRENT_REF=$(git rev-parse HEAD)

if [ -f "$LAST_REF_FILE" ]; then
  BEFORE_REF=$(cat "$LAST_REF_FILE")
else
  BEFORE_REF=$(git merge-base origin/main HEAD) # fallback
fi

CHANGELOG=$(git log --pretty=format:"%s" "$BEFORE_REF..$CURRENT_REF")

# Save with preserved line breaks
echo -e "$CHANGELOG" > changelog.txt
echo "$CURRENT_REF" > "$LAST_REF_FILE"

echo "📝 CHANGELOG written to changelog.txt:"
cat changelog.txt


echo "✅ Done. Now check your GitHub Actions changelog result!"
