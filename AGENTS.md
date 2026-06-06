# AGENTS.md

## 项目目标

本仓库用于建设「力天空间设计」企业官网，要求包含：

- 前台企业网站：不少于 20 个简体中文内容页。
- 后台管理：无需改源码即可编辑前台内容。
- 业务功能：预约咨询、销售登记、员工资料、客户资料、员工登录、客户注册/登录。
- 部署目标域名：`litian.zbhaowen.top`。

## 技术栈

- 前端：React + Vite + React Router + CSS。
- 后端：Node.js + Express + SQLite。
- 登录鉴权：JWT。

## 开发规范

- 优先保持内容可配置化：前台文案、案例、公告、FAQ 等应来自后台 API 或种子数据。
- 不要把客户、员工、销售等隐私资料硬编码到前端。
- 后台接口新增或修改时，同步更新前端调用与 README。
- 所有新增页面应在 `server/src/content.js` 中有初始内容，且能通过后台编辑。
- 修改 UI 后请至少运行 `npm run build --workspace client`。
- 修改后端 API 后请运行 `npm run test --workspace server`。

## 常用命令

```bash
npm install
npm run dev
npm run build
npm run test --workspace server
```

## 默认后台账号

首次启动会读取 `.env`：

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

生产部署前必须修改默认密码和 `JWT_SECRET`。
