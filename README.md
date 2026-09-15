# Zhaoxi.Web · 后台管理系统前端

用 **Vue 3 + Vite + Element Plus** 写的后台管理前端。菜单和路由根据登录用户的权限，由后端动态下发。
这个仓库的重点是**前端发布流程**：打 tag 发布，服务器上用软链做原子切换，发布后自动验证，失败时自动回滚，并保留最近 5 个版本可以随时切回。

[![部署到 linux-C](https://github.com/liangfeng-hash/Zhaoxi.Web/actions/workflows/deploy-linux.yml/badge.svg)](https://github.com/liangfeng-hash/Zhaoxi.Web/actions/workflows/deploy-linux.yml)

- 线上地址：<https://fengyuan.online>
- 发布记录：[Actions](https://github.com/liangfeng-hash/Zhaoxi.Web/actions)
- 配套仓库：[Zhaoxi.Management](https://github.com/liangfeng-hash/Zhaoxi.Management)（.NET 8 后端）· [Zhaoxi.Gateway](https://github.com/liangfeng-hash/Zhaoxi.Gateway)（YARP 网关）

## 技术栈

| 分类 | 选型 |
| --- | --- |
| 框架 | Vue 3（`<script setup>`）、Vite、Vue Router（hash 模式） |
| UI | Element Plus（按需自动引入）、ECharts、高德地图 JS API |
| 状态 | Pinia + 持久化插件 |
| 请求 | axios 统一封装：自动带 token，AccessToken 过期后用 RefreshToken 无感刷新 |
| 质量 | ESLint 9（flat config）+ Prettier，lint 不通过时 CI 直接中止 |

## 权限与路由

```mermaid
sequenceDiagram
    participant B as 浏览器
    participant R as 路由守卫
    participant Auth as /auth（IdentityApi）
    participant Api as /api（MentApi）
    B->>Auth: 登录
    Auth-->>B: AccessToken + RefreshToken（存入 Pinia）
    B->>R: 跳转页面
    R->>Api: 拉取当前用户的菜单
    Api-->>R: 菜单树（带组件路径）
    R->>R: router.addRoute 动态注册路由
    Note over B,Api: AccessToken 过期时，axios 拦截器用 RefreshToken 换新 token，然后重放原请求
```

所有 API 地址都用相对路径（`/api`、`/auth`），环境之间的差异交给 Nginx 或 YARP 处理。所以**同一份 `dist` 可以部署到任何环境**：开发时由 Vite proxy 转发，生产上由 Nginx 反向代理。

## 发布流水线

```mermaid
flowchart TB
    T([git push tag v1.0.x]) --> B

    subgraph B [build · GitHub 云端 ubuntu-latest]
        B1[npm ci<br/>严格按 lock 文件安装] --> B2[npm run lint:check<br/>CI 闸门]
        B2 --> B3[vite build]
        B3 --> B4[上传 artifact<br/>约 0.8MB]
    end

    B --> D

    subgraph D [deploy · linux-C 上的 self-hosted runner]
        D1[下载产物<br/>放进 releases/编号-tag/] --> D2[记下当前软链指向的版本]
        D2 --> D3[原子切换<br/>ln -sfn + mv -T]
        D3 --> D4[验证：首页 200<br/>index.html 引用的 JS 资源也能访问]
        D4 --> D5[清理旧版本，保留 5 个]
    end

    D4 -. 失败 .-> R[软链切回上一个版本]
```

### 服务器目录结构

```
/var/www/
├── releases/
│   ├── 8-v1.0.3/
│   ├── 9-v1.0.4/
│   └── 10-v1.0.5/      ← 当前版本
└── vue -> releases/10-v1.0.5    # Nginx root 指向这个软链
```

### 设计取舍

| 问题 | 做法 | 原因 |
| --- | --- | --- |
| 前端要不要进容器 | **不进容器**，由宿主机 Nginx 直接托管静态文件 | 宿主机 Nginx 已经配好了 HTTPS、缓存和反向代理，放进容器只会多套一层 Nginx |
| 怎么做到零停机切换 | 先建新软链，再 `mv -T` 覆盖旧软链 | `ln -sfn` 是先删后建，中间有一瞬间软链不存在；`mv -T` 底层是 `rename(2)`，属于原子操作 |
| 怎么回滚 | 旧版本目录都还在，把软链指回去即可 | 秒级完成，不用重新构建 |
| 在哪里构建 | GitHub 云端 runner | 服务器从 GitHub 下载很慢（~20KB/s），但前端产物只有 0.8MB，可以接受；后端镜像大，所以改走镜像仓库 |

### 实际踩过的坑

- **清理旧版本时差点删掉新版本**：`cp -a` 会把源目录的 mtime 一起带过去，导致 `ls -t` 排序错乱。现在落地后先 `touch`，清理时按 run_number 排序。
- **`ln: Permission denied`**：替换软链改的是**父目录**的目录项，所以要看父目录的写权限，而不是软链本身的权限。
- **`npm install` 能跑，`npm ci` 却失败**：`npm ci` 严格按 lock 文件安装，peer 依赖冲突时会直接退出。上 CI 之前，先在本地把 CI 的三步完整跑一遍。

## 多环境

| 环境 | 部署方式 | 流水线 |
| --- | --- | --- |
| 生产 linux-C | Nginx 托管 + 软链切换 | `deploy-linux.yml`（tag 触发） |
| 本机 Windows | 同步到 YARP 网关的 `wwwroot`，由网关统一托管前端和 API | `deploy-local.yml` |

## Nginx 反向代理与负载均衡

生产环境的入口是 linux-C 上的 Nginx：静态文件由它直接托管，`/api`、`/auth` 转发到后端集群。
集群阶段接入了 3 个后端节点，横跨 Linux 和 Windows：

```mermaid
flowchart LR
    U[浏览器] -->|HTTPS| N[Nginx · linux-C]
    N -->|/| S[静态文件<br/>/var/www/vue 软链]
    N -->|/api| A{{upstream zhaoxi_api<br/>least_conn}}
    N -->|/auth| H{{upstream zhaoxi_auth<br/>least_conn}}
    A -->|weight=2| L1[linux-C · Docker 容器]
    A -->|weight=1| W1[win-A · IIS]
    A -->|weight=1| W2[win-B · IIS]
    H -->|weight=2| L2[linux-C · Docker 容器]
    H -->|weight=1| W3[win-A · IIS]
    L1 & W1 & W2 & L2 & W3 --> DB[(同一个 SQL Server)]
```

### 核心配置

```nginx
# /etc/nginx/conf.d/upstream.conf（http 层）
upstream zhaoxi_api {
    zone zhaoxi_api 64k;      # 共享内存，所有 worker 共用失败计数和连接数
    least_conn;               # 最少连接优先

    server 127.0.0.1:8000     weight=2 max_fails=2 fail_timeout=30s;   # linux-C 本机容器
    server <win-A 内网 IP>:8000 weight=1 max_fails=2 fail_timeout=30s;
    server <win-B 内网 IP>:8000 weight=1 max_fails=2 fail_timeout=30s;

    keepalive 32;             # 与后端保持长连接
}

# /etc/nginx/sites-available/zhaoxi（location 层）
location /api/ {
    proxy_pass http://zhaoxi_api;
    proxy_http_version 1.1;   # keepalive 必须配合 HTTP/1.1
    proxy_set_header Connection "";

    # 某个节点出错或超时，自动换一台重试，用户无感
    proxy_next_upstream error timeout http_502 http_503 http_504;
    proxy_next_upstream_tries 2;
    proxy_next_upstream_timeout 10s;
}
```

| 参数 | 作用 |
| --- | --- |
| `least_conn` | 请求耗时差异大时，比默认轮询分配更均衡 |
| `weight=2` | 本机容器走回环地址，延迟最低，分配双倍流量 |
| `max_fails=2` `fail_timeout=30s` | 30 秒内失败 2 次就摘除该节点 30 秒，之后放一个请求试探 |
| `proxy_next_upstream` | 失败请求自动转到下一台，配合上面的被动摘除实现故障转移 |

### 负载均衡的前提：后端无状态

- **统一数据库**：所有节点连同一个 SQL Server，否则请求落到不同节点，查到的数据不一样。
- **统一 JWT 密钥**：节点 A 签发的 token 必须能在节点 B 验签通过，否则登录后刷新页面就会随机 401。
- **不在节点本地存状态**：会话信息都放在 token 里，不依赖某台机器的内存。

### 验证方法

```bash
# 日志里加 $upstream_addr，统计请求实际分到了哪些节点
sudo tail -200 /var/log/nginx/access.log | grep -oE 'upstream=[0-9.:]+' | sort | uniq -c

# 停掉 win-A 上的 API 后连续请求：应全部成功，日志里能看到先打 win-A 失败、再转到其他节点
# upstream=10.x.x.x:8000, 127.0.0.1:8000
```

### 实际踩过的坑

- **开源版 Nginx 没有主动健康检查**：那是商业版 Nginx Plus 的功能。开源版用「`max_fails` 被动摘除 + `proxy_next_upstream` 失败重试」组合，效果已经够用。
- **故障节点摘不干净**：不加 `zone` 时，每个 worker 进程各自记失败次数，要累计「worker 数 × max_fails」次失败才会全部摘除，日志里能看到请求反复打到已经挂掉的节点。加上 `zone` 共享状态后解决，`least_conn` 的连接数统计也因此变准。
- **跨机器连不上后端**：安全组放行的源 IP 要填 linux-C 的**内网 IP**，不是公网 IP，因为节点之间走的是内网。
- **Windows 节点绑定地址**：IIS 站点不能只绑定 `127.0.0.1`，否则只接受本机请求，Nginx 转发过去会被拒绝连接。

> 现状：两台 Windows 节点是云服务器试用机，到期后已下线，目前 upstream 只保留 linux-C 本机节点。配置结构没变，新增节点只需要加一行 `server`。

## 本地开发

```bash
npm install
npm run dev    # .env.development 默认把请求代理到 localhost:8000（API）和 localhost:8001（认证）
```
