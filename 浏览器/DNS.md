# DNS

#### **第三步：DNS 解析**

> 每一次 DNS 解析时间预计在 20~120 毫秒
>
> 如果不是第一次，那就有缓存会先走缓存
>
> - 减少 DNS 请求次数
> - DNS 预获取（DNS Prefetch）
>
> <meta http-equiv="x-dns-prefetch-control" content="on">
> <link rel="dns-prefetch" href="//static.360buyimg.com"/>

- 递归查询
- 迭代查询

![DNS解析-递归查询](../../static/images/DNS解析-递归查询.png)