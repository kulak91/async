#!/bin/bash
set -e

# Названия веток
BASE_BRANCH="weekly"
TARGET_BRANCH="develop"
NEW_BRANCH="feature-auto-branch-2"

# Проверка что мы в гите
git rev-parse --is-inside-work-tree > /dev/null 2>&1 || { echo "Not a git repo"; exit 1; }

# Обновим ветки
git fetch origin

# Создаём новую ветку от weekly
git checkout -B "$NEW_BRANCH" "origin/$BASE_BRANCH"

# Делаем 3 фиктивных коммита
for i in 1 2 3; do
  echo "commit $i" >> "dummy_$i.txt"
  git add .
  git commit -m "Auto commit $i"
done

# Пушим новую ветку
# git push origin "$NEW_BRANCH"
git push --force-with-lease origin "$NEW_BRANCH"

# Создаём PR и мержим в weekly (нужен GitHub CLI)
gh pr create --base "$BASE_BRANCH" --head "$NEW_BRANCH" --title "Auto PR to $BASE_BRANCH" --body "Generated PR"
gh pr merge --merge --delete-branch

# Ждём мерджа (можно заменить на sleep, если нет вебхуков)
echo "Waiting for PR to be merged..."
while git ls-remote --exit-code --heads origin "$NEW_BRANCH" >/dev/null; do
  sleep 5
done

# Обновим локальную weekly и смержим в develop
git checkout "$TARGET_BRANCH"
git pull origin "$TARGET_BRANCH"
git merge origin/"$BASE_BRANCH" --no-edit

# Пушим в develop
git push origin "$TARGET_BRANCH"


git checkout "$BASE_BRANCH"
git reset --hard origin/"$BASE_BRANCH"

git checkout "$TARGET_BRANCH"
git reset --hard origin/"$TARGET_BRANCH"
