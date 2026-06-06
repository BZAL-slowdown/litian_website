# 宝塔部署说明

部署域名：`litian.zbhaowen.top`

## 服务器要求

- Node.js 20 或更高版本。
- Nginx。
- 宝塔 Node 项目管理器或 PM2 管理器。

## 上传目录

将部署包上传到：

```text
/www/wwwroot/litian.zbhaowen.top
```

部署包不要包含本机 `node_modules`。请在服务器上执行安装，避免 Windows 原生依赖与 Linux 不兼容。

## 首次部署命令

在宝塔终端进入站点目录：

```bash
cd /www/wwwroot/litian.zbhaowen.top
npm ci --omit=dev
mkdir -p server/data
cp .env.production.example .env
nano .env
```

必须修改 `.env`：

```text
JWT_SECRET=至少32位随机字符串
ADMIN_PASSWORD=强密码
PUBLIC_SITE_URL=https://litian.zbhaowen.top
```

启动：

```bash
npm start
```

## PM2 启动

```bash
pm2 start server/src/index.js --name litian-website
pm2 save
```

## Nginx 反代

将域名反向代理到：

```text
http://127.0.0.1:4000
```

推荐配置：

```nginx
location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 更新部署

1. 备份 `server/data/litian.sqlite` 和 `.env`。
2. 上传新部署包并覆盖源码。
3. 不要覆盖 `.env` 和 `server/data`。
4. 执行：

```bash
npm ci --omit=dev
pm2 restart litian-website
```

## 验证

- 前台：`https://litian.zbhaowen.top`
- 后台：`https://litian.zbhaowen.top/admin`
- 健康检查：`https://litian.zbhaowen.top/api/health`
