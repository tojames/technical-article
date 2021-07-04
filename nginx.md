# Nginx

> 是一款轻量级的HTTP服务器，采用事件驱动的一步非堵塞处理方式框架，这让其具有极好的IO性能，时常用于服务端的反向代理和负载均衡
>
> 开源且高性能，可靠的HTTP中间件和代理服务器
>
> Nginx优势
>
> IO多路服用：多个描述符的IO操作都能在一个线程里并发交替顺序完成，服用线程
>
> CPU亲和：一种把CPU核心和Nginx工作进程绑定方式，把每个worker进程固定在一个CPU核上执行
>
> sendfile 零拷贝传输模式 不需要经过用户空间



```
快速搭建

Mainline version 开发版
Stable version 稳定版
Legacy version 历史版本

安装nginx
yum -y install gcc gcc-c++autoconf pcre pcre-devel make automake openssl openssl-devel
yum -y install wget httpd-tools vim
```

