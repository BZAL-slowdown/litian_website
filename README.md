# 力天空间设计企业官网

一个干净的全栈企业网站项目，前台展示力天空间设计内容，后台可编辑页面、公告、案例，并管理预约、销售、客户、员工资料。

## 功能

- 20+ 个企业内容页：首页、关于我们、品牌理念、公司故事、服务模式、住宅设计、商业设计、流程、全屋定制、案例、伙伴、客户中心、预约、FAQ、登录/注册、联系、隐私政策、服务条款等。
- 后台内容管理：页面标题、摘要、正文、排序、发布状态。
- 业务数据管理：预约、销售线索、客户资料、员工资料。
- 员工登录与客户登录接口。
- SQLite 数据库，适合快速部署和迁移。

## 启动

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

前台地址：`http://localhost:5173`

后台地址：`http://localhost:5173/admin`

API 地址：`http://localhost:4000/api`

## 部署提示

1. 在服务器上配置 `.env`，至少修改 `JWT_SECRET`、`ADMIN_USERNAME`、`ADMIN_PASSWORD`。
2. 执行 `npm install && npm run build`。
3. 用 `npm start` 启动后端。
4. Nginx 将 `litian.zbhaowen.top` 指向后端端口，后端会托管前端 `client/dist`。

## GitHub

远程仓库目标：`https://github.com/BZAL-slowdown/litian_website.git`
