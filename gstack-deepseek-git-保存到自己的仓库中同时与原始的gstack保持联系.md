# gstack-deepseek Git 指南

如何把当前项目保存到自己的 GitHub 仓库中，同时持续和原始 `gstack` 保持同步更新。

## 目标

实现这两个目标：

1. 把当前修改后的 `gstack` 保存到你自己的 GitHub 仓库
2. 后续仍然可以同步原始 `gstack` 的官方更新，不和上游仓库割裂

## 推荐做法

推荐使用下面的远程仓库结构：

- `origin`：你的 GitHub 仓库
- `upstream`：原始官方仓库 `garrytan/gstack`

这种结构的好处：

- 你可以自由保存自己的 DeepSeek 改动
- 以后官方 `gstack` 有更新时，可以继续同步
- 如果后面你想给官方提 PR，这也是标准工作流

## 第一步：在 GitHub 上创建你自己的仓库

例如：

```text
https://github.com/你的用户名/gstack
```

## 第二步：先提交你当前本地改动

在仓库根目录执行：

```bash
cd /Users/ceo/gstack
git add .
git commit -m "Add DeepSeek integration and DeepSeek-prefixed skills"
```

## 第三步：把官方仓库保留为 upstream

把当前的 `origin` 改名为 `upstream`：

```bash
git remote rename origin upstream
```

然后把你自己的 GitHub 仓库添加为新的 `origin`：

```bash
git remote add origin https://github.com/你的用户名/gstack.git
```

## 第四步：检查远程仓库配置

执行：

```bash
git remote -v
```

你应该看到类似：

```bash
origin   https://github.com/你的用户名/gstack.git (fetch)
origin   https://github.com/你的用户名/gstack.git (push)
upstream https://github.com/garrytan/gstack.git (fetch)
upstream https://github.com/garrytan/gstack.git (push)
```

## 第五步：推送到你自己的 GitHub 仓库

```bash
git push -u origin main
```

这样你当前的修改版 `gstack` 就会保存到你自己的 GitHub 仓库中。

## 以后如何同步官方 gstack 更新

如果原始 `gstack` 有更新，你可以这样同步：

### 1. 获取官方仓库最新内容

```bash
git fetch upstream
```

### 2. 切回你的主分支

```bash
git checkout main
```

### 3. 合并官方更新

```bash
git merge upstream/main
```

如果你更喜欢保持提交历史更整洁，也可以使用：

```bash
git rebase upstream/main
```

### 4. 把同步后的结果推回你自己的仓库

```bash
git push origin main
```

## 如果你不想保留 upstream

如果你只是想简单地把当前仓库改成你自己的 GitHub 仓库，而不考虑以后同步官方更新，也可以直接这样做：

```bash
git remote set-url origin https://github.com/你的用户名/gstack.git
git push -u origin main
```

但这不是最推荐的方案，因为后续同步官方更新会不方便。

## 为什么更推荐 upstream + origin 结构

因为你现在的目标不是“复制一份然后彻底分叉”，而是：

- 保留你自己的 DeepSeek 扩展
- 同时继续跟进原始 `gstack` 的演进

这正是 `fork + upstream` 工作流最适合的场景。

## 安全注意事项

### 不会自动上传的内容

你写在 `~/.bashrc` 里的：

- `DEEPSEEK_API_KEY`
- `DEEPSEEK_BASE_URL`
- `DEEPSEEK_MODEL`

不在仓库目录里，所以不会被 Git 推送到 GitHub。

### 需要特别检查的内容

如果你把 API key 写进了仓库文件中，就不要提交。

推送前建议先检查一次：

```bash
git status
git diff --cached
```

确认没有：

- API key
- 私有地址
- 本地账号信息
- 不想公开的临时调试内容

## 建议的长期工作方式

推荐这样使用：

1. 平时在你自己的仓库里开发和提交
2. 官方有更新时，用 `upstream` 同步
3. 如果你做出的改动以后想贡献回原始 `gstack`，再从你的仓库发 PR 到官方

## 一套最稳的完整命令

下面是一套可以直接照着执行的命令流程：

```bash
cd /Users/ceo/gstack
git add .
git commit -m "Add DeepSeek integration and DeepSeek-prefixed skills"
git remote rename origin upstream
git remote add origin https://github.com/你的用户名/gstack.git
git remote -v
git push -u origin main
```

以后同步官方更新：

```bash
cd /Users/ceo/gstack
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## 一句话总结

最推荐的做法是：

- 你的仓库 = `origin`
- 官方仓库 = `upstream`

这样你既能保留自己的 DeepSeek 改造，又能长期同步原始 `gstack` 的更新。
