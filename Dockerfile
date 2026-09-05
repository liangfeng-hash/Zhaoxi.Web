
# node镜像
FROM node:latest as build-stage

# 指定接下来的工作路径为/app  - 类似于cd命令
WORKDIR /app


# 拷贝前端项目 当前目录下的所有文件到app目录下(./指当前所有的代码路径 .指上一步cd到app的路径)
COPY . .


# 设置淘宝npm镜像
RUN npm install -g npm --registry=https://registry.npm.taobao.org


# 安装依赖
RUN npm install


# 打包 - 目的：丢到nginx下跑
RUN npm run build


# nginx镜像
FROM nginx:latest as production-stage


# # 拷贝前端vue项目打包后生成的文件到nginx下运行
COPY --from=build-stage /app/dist /usr/share/nginx/html


# 暴露80端口
EXPOSE 80


# 使用daemon off的方式将nginx运行在前台保证镜像不至于退出
CMD ["nginx", "-g", "daemon off;"]