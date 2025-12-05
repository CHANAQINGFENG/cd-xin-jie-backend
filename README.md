#!/bin/bash

# 一键重命名所有 .txt 为 .js，并自动 commit + push 到 GitHub
# 使用前请确认已设置 Git remote 并已备份当前修改

# 1. 批量重命名 .txt -> .js
find . -type f -name "*.txt" | while read file; do
    newfile="${file%.txt}"
    echo "Renaming $file -> $newfile"
    mv "$file" "$newfile"
done

echo "所有 .txt 文件已重命名为 .js 文件（保留原路径）"

# 2. Git 提交并推送
git add .
git commit -m "fix: rename all .txt files to .js"
git push

echo "已将修改提交并推送到远程仓库"

echo "现在可以重新部署 Render，入口文件 server.js 应该可被识别"
