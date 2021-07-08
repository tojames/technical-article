# CSRF「Cross-site request forgery」



# 什么是CSRF？

> 跨站请求伪造，冒用Cookie中的信息，发起请求攻击。
>
> CSRF（Cross-site request forgery）跨站请求伪造：攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。



# 场景

> 当用户已经登录成功了一个网站，然后通过被诱导进了第三方网站「钓鱼网站」，
> 第三方网站，其实拿不到用户cookie，只是用户跳转过去了自动提交表单，提交的接口是用户登陆的网站接口，因为提交表单的信息是同源的原因会自动将cookie数据给后台，后台则正常走逻辑将用户提交的表单信息，可以通过抓包，或者浏览器查看即可知道，就可以自己伪造一个表单请求了。
> 而且这里也不会触发同源策略，因为只是表单请求，同源策略是针对ajax



# CSRF攻击类型

```
1.GET类型的CSRF，img标签 script。
	![](https://awps-assets.meituan.net/mit-x/blog-images-bundle-2018b/ff0cdbee.example/withdraw?amount=10000&for=hacker)
	在受害者访问含有这个img的页面后，浏览器会自动向http://bank.example/withdraw?account=xiaoming&amount=10000&for=hacker发出一次HTTP请求。bank.example就会收到包含受害者登录信息的一次跨域请求。
	
2.post类型的SCRF 表单中的post请求
 <form action="http://bank.example/withdraw" method=POST>
    <input type="hidden" name="account" value="xiaoming" />
    <input type="hidden" name="amount" value="10000" />
    <input type="hidden" name="for" value="hacker" />
</form>
<script> document.forms[0].submit(); </script> 
访问该页面后，表单会自动提交，相当于模拟用户完成了一次POST操作。

3.链接类型的CSRF a标签
  <a href="http://test.com/csrf/withdraw.php?amount=1000&for=hacker" taget="_blank">
  重磅消息！！
  <a/>
  只要用户点击了，就会被攻击成功
  
  


1.添加验证码
2.后台增加判断请求头来源 referer。这个也可以伪造
3.token

双重cookie
他意思是在提交前先用js读取用于验证的cookie值加入到提交字段。这样就形成了双提交（验证字段有两份，一份在cookie中，一份在POST或URL中）。显然单纯的csrf只能让请求中带有cookie但是并不能读取cookie加入到POST或URL中。


阻止不明外域的访问
	同源检测
Samesite Cookie 
提交时要求附加本域才能获取的信息
CSRF Token
双重Cookie验证

Samesite Cookie
Google 起草了一份草案来改进 HTTP 协议，那就是为 Set-Cookie 响应头新增 SameSite 属性，它用来标明这个 cookie 是个“同站 cookie”，同站 cookie 只能作为第一方 cookie，不能作为第三方 cookie。SameSite 有两个属性值，分别是 Strict 和 Lax
严格模式，表明这个 cookie 在任何情况下都不可能作为第三方 cookie，绝无例外。Set-Cookie: foo=1; SameSite=Strict
宽松模式，比 Strict 放宽了点限制：假如这个请求是我上面总结的那种同步请求（改变了当前页面或者打开了新页面）且同时是个 GET 请求（因为从语义上说 GET 是读取操作，比 POST 更安全），则这个 cookie 可以作为第三方 cookie。SameSite=Strict
```



# CSRF的特点

```
攻击一般发起在第三方网站，而不是被攻击的网站。被攻击的网站无法防止攻击发生。
攻击利用受害者在被攻击网站的登录凭证，冒充受害者提交操作；而不是直接窃取数据。
整个过程攻击者并不能获取到受害者的登录凭证，仅仅是“冒用”。
跨站请求可以用各种方式：图片URL、超链接、CORS、Form提交等等。部分请求方式可以直接嵌入在第三方论坛、文章中，难以进行追踪。
CSRF通常是跨域的，因为外域通常更容易被攻击者掌控。但是如果本域下有容易被利用的功能，比如可以发图和链接的论坛和评论区，攻击可以直接在本域下进行，而且这种攻击更加危险。
```



# 防护策略

```
CSRF通常从第三方网站发起，被攻击的网站无法防止攻击发生，只能通过增强自己网站针对CSRF的防护能力来提升安全性。

上文中讲了CSRF的两个特点：

- CSRF（通常）发生在第三方域名。
- CSRF攻击者不能获取到Cookie等信息，只是使用。

针对这两点，我们可以专门制定防护策略，如下：

- 阻止不明外域的访问
  - 同源检测
  - Samesite Cookie
- 提交时要求附加本域才能获取的信息
  - CSRF Token
  - 双重Cookie验证
  
  
  
  
同源检测
既然CSRF大多来自第三方网站，那么我们就直接禁止外域（或者不受信任的域名）对我们发起请求。
那么问题来了，我们如何判断请求是否来自外域呢？
在HTTP协议中，每一个异步请求都会携带两个Header，用于标记来源域名：
Origin Header
Referer Header
这两个Header在浏览器发起请求时，大多数情况会自动带上，并且不能由前端自定义内容。 服务器可以通过解析这两个Header中的域名，确定请求的来源域。
使用Origin Header确定来源域名
在部分与CSRF有关的请求中，请求的Header中会携带Origin字段。字段内包含请求的域名（不包含path及query）。
如果Origin存在，那么直接使用Origin中的字段确认来源域名就可以。
但是Origin在以下两种情况下并不存在：
IE11同源策略： IE 11 不会在跨站CORS请求上添加Origin标头，Referer头将仍然是唯一的标识。最根本原因是因为IE 11对同源的定义和其他浏览器有不同，有两个主要的区别，可以参考MDN Same-origin_policy#IE_Exceptions
302重定向： 在302重定向之后Origin不包含在重定向的请求中，因为Origin可能会被认为是其他来源的敏感信息。对于302重定向的情况来说都是定向到新的服务器上的URL，因此浏览器不想将Origin泄漏到新的服务器上。

使用Referer Header确定来源域名
根据HTTP协议，在HTTP头中有一个字段叫Referer，记录了该HTTP请求的来源地址。 对于Ajax请求，图片和script等资源请求，Referer为发起请求的页面地址。对于页面跳转，Referer为打开页面历史记录的前一个页面地址。因此我们使用Referer中链接的Origin部分可以得知请求的来源域名。

这种方法并非万无一失，Referer的值是由浏览器提供的，虽然HTTP协议上有明确的要求，但是每个浏览器对于Referer的具体实现可能有差别，并不能保证浏览器自身没有安全漏洞。使用验证 Referer 值的方法，就是把安全性都依赖于第三方（即浏览器）来保障，从理论上来讲，这样并不是很安全。在部分情况下，攻击者可以隐藏，甚至修改自己请求的Referer。


Samesite Cookie属性
防止CSRF攻击的办法已经有上面的预防措施。为了从源头上解决这个问题，Google起草了一份草案来改进HTTP协议，那就是为Set-Cookie响应头新增Samesite属性，它用来标明这个 Cookie是个“同站 Cookie”，同站Cookie只能作为第一方Cookie，不能作为第三方Cookie，Samesite 有两个属性值，分别是 Strict 和 Lax，下面分别讲解：

Samesite=Strict
这种称为严格模式，表明这个 Cookie 在任何情况下都不可能作为第三方 Cookie，绝无例外。比如说 b.com 设置了如下 Cookie：

Set-Cookie: foo=1; Samesite=Strict
Set-Cookie: bar=2; Samesite=Lax
Set-Cookie: baz=3
我们在 a.com 下发起对 b.com 的任意请求，foo 这个 Cookie 都不会被包含在 Cookie 请求头中，但 bar 会。举个实际的例子就是，假如淘宝网站用来识别用户登录与否的 Cookie 被设置成了 Samesite=Strict，那么用户从百度搜索页面甚至天猫页面的链接点击进入淘宝后，淘宝都不会是登录状态，因为淘宝的服务器不会接受到那个 Cookie，其它网站发起的对淘宝的任意请求都不会带上那个 Cookie。

Samesite=Lax
这种称为宽松模式，比 Strict 放宽了点限制：假如这个请求是这种请求（改变了当前页面或者打开了新页面）且同时是个GET请求，则这个Cookie可以作为第三方Cookie。比如说 b.com设置了如下Cookie：

Set-Cookie: foo=1; Samesite=Strict
Set-Cookie: bar=2; Samesite=Lax
Set-Cookie: baz=3
当用户从 a.com 点击链接进入 b.com 时，foo 这个 Cookie 不会被包含在 Cookie 请求头中，但 bar 和 baz 会，也就是说用户在不同网站之间通过链接跳转是不受影响了。但假如这个请求是从 a.com 发起的对 b.com 的异步请求，或者页面跳转是通过表单的 post 提交触发的，则bar也不会发送。

我们应该如何使用SamesiteCookie
如果SamesiteCookie被设置为Strict，浏览器在任何跨域请求中都不会携带Cookie，新标签重新打开也不携带，所以说CSRF攻击基本没有机会。

但是跳转子域名或者是新标签重新打开刚登陆的网站，之前的Cookie都不会存在。尤其是有登录的网站，那么我们新打开一个标签进入，或者跳转到子域名的网站，都需要重新登录。对于用户来讲，可能体验不会很好。

如果SamesiteCookie被设置为Lax，那么其他网站通过页面跳转过来的时候可以使用Cookie，可以保障外域连接打开页面时用户的登录状态。但相应的，其安全性也比较低。

另外一个问题是Samesite的兼容性不是很好，现阶段除了从新版Chrome和Firefox支持以外，Safari以及iOS Safari都还不支持，现阶段看来暂时还不能普及。

而且，SamesiteCookie目前有一个致命的缺陷：不支持子域。例如，种在topic.a.com下的Cookie，并不能使用a.com下种植的SamesiteCookie。这就导致了当我们网站有多个子域名时，不能使用SamesiteCookie在主域名存储用户登录信息。每个子域名都需要用户重新登录一次。

总之，SamesiteCookie是一个可能替代同源验证的方案，但目前还并不成熟，其应用场景有待观望。


CSRF Token
前面讲到CSRF的另一个特征是，攻击者无法直接窃取到用户的信息（Cookie，Header，网站内容等），仅仅是冒用Cookie中的信息。

而CSRF攻击之所以能够成功，是因为服务器误把攻击者发送的请求当成了用户自己的请求。那么我们可以要求所有的用户请求都携带一个CSRF攻击者无法获取到的Token。服务器通过校验请求是否携带正确的Token，来把正常的请求和攻击的请求区分开，也可以防范CSRF的攻击。

token是一个比较有效的CSRF防护方法，只要页面没有XSS漏洞泄露Token，那么接口的CSRF攻击就无法成功。


双重Cookie验证
在会话中存储CSRF Token比较繁琐，而且不能在通用的拦截上统一处理所有的接口。

那么另一种防御措施是使用双重提交Cookie。利用CSRF攻击不能获取到用户Cookie的特点，我们可以要求Ajax和表单请求携带一个Cookie中的值。

双重Cookie采用以下流程：

在用户访问网站页面时，向请求域名注入一个Cookie，内容为随机字符串（例如csrfcookie=v8g9e4ksfhw）。
在前端向后端发起请求时，取出Cookie，并添加到URL的参数中（接上例POST https://www.a.com/comment?csrfcookie=v8g9e4ksfhw）。
后端接口验证Cookie中的字段与URL参数中的字段是否一致，不一致则拒绝。
此方法相对于CSRF Token就简单了许多。可以直接通过前后端拦截的的方法自动化实现。后端校验也更加方便，只需进行请求中字段的对比，而不需要再进行查询和存储Token。

当然，此方法并没有大规模应用，其在大型网站上的安全性还是没有CSRF Token高，原因我们举例进行说明。

由于任何跨域都会导致前端无法获取Cookie中的字段（包括子域名之间），于是发生了如下情况：

如果用户访问的网站为www.a.com，而后端的api域名为api.a.com。那么在www.a.com下，前端拿不到api.a.com的Cookie，也就无法完成双重Cookie认证。
于是这个认证Cookie必须被种在a.com下，这样每个子域都可以访问。
任何一个子域都可以修改a.com下的Cookie。
某个子域名存在漏洞被XSS攻击（例如upload.a.com）。虽然这个子域下并没有什么值得窃取的信息。但攻击者修改了a.com下的Cookie。
攻击者可以直接使用自己配置的Cookie，对XSS中招的用户再向www.a.com下，发起CSRF攻击。
总结：
用双重Cookie防御CSRF的优点：

无需使用Session，适用面更广，易于实施。
Token储存于客户端中，不会给服务器带来压力。
相对于Token，实施成本更低，可以在前后端统一拦截校验，而不需要一个个接口和页面添加。
缺点：

Cookie中增加了额外的字段。
如果有其他漏洞（例如XSS），攻击者可以注入Cookie，那么该防御方式失效。
难以做到子域名的隔离。
为了确保Cookie传输安全，采用这种防御方式的最好确保用整站HTTPS的方式，如果还没切HTTPS的使用这种方式也会有风险。
```

# 防止网站被利用

前面所说的，都是被攻击的网站如何做好防护。而非防止攻击的发生，CSRF的攻击可以来自：

- 攻击者自己的网站。
- 有文件上传漏洞的网站。
- 第三方论坛等用户内容。
- 被攻击网站自己的评论功能等。

对于来自黑客自己的网站，我们无法防护。但对其他情况，那么如何防止自己的网站被利用成为攻击的源头呢？

- 严格管理所有的上传接口，防止任何预期之外的上传内容（例如HTML）。
- 添加Header `X-Content-Type-Options: nosniff` 防止黑客上传HTML内容的资源（例如图片）被解析为网页。
- 对于用户上传的图片，进行转存或者校验。不要直接使用用户填写的图片链接。
- 当前用户打开其他用户填写的链接时，需告知风险（这也是很多论坛不允许直接在内容中发布外域链接的原因之一，不仅仅是为了用户留存，也有安全考虑）。

# CSRF其他防范措施

对于一线的程序员同学，我们可以通过各种防护策略来防御CSRF，对于QA、SRE、安全负责人等同学，我们可以做哪些事情来提升安全性呢？

# CSRF测试

CSRFTester是一款CSRF漏洞的测试工具，CSRFTester工具的测试原理大概是这样的，使用代理抓取我们在浏览器中访问过的所有的连接以及所有的表单等信息，通过在CSRFTester中修改相应的表单等信息，重新提交，相当于一次伪造客户端请求，如果修改后的测试请求成功被网站服务器接受，则说明存在CSRF漏洞，当然此款工具也可以被用来进行CSRF攻击。 CSRFTester使用方法大致分下面几个步骤：

**步骤1：设置浏览器代理**

CSRFTester默认使用Localhost上的端口8008作为其代理，如果代理配置成功，CSRFTester将为您的浏览器生成的所有后续HTTP请求生成调试消息。

**步骤2：使用合法账户访问网站开始测试**

我们需要找到一个我们想要为CSRF测试的特定业务Web页面。找到此页面后，选择CSRFTester中的“开始录制”按钮并执行业务功能；完成后，点击CSRFTester中的“停止录制”按钮；正常情况下，该软件会全部遍历一遍当前页面的所有请求。

**步骤3：通过CSRF修改并伪造请求**

之后，我们会发现软件上有一系列跑出来的记录请求，这些都是我们的浏览器在执行业务功能时生成的所有GET或者POST请求。通过选择列表中的某一行，我们现在可以修改用于执行业务功能的参数，可以通过点击对应的请求修改query和form的参数。当修改完所有我们希望诱导用户form最终的提交值，可以选择开始生成HTML报告。

**步骤4：拿到结果如有漏洞进行修复**

首先必须选择“报告类型”。报告类型决定了我们希望受害者浏览器如何提交先前记录的请求。目前有5种可能的报告：表单、iFrame、IMG、XHR和链接。一旦选择了报告类型，我们可以选择在浏览器中启动新生成的报告，最后根据报告的情况进行对应的排查和修复。

# CSRF监控

对于一个比较复杂的网站系统，某些项目、页面、接口漏掉了CSRF防护措施是很可能的。

一旦发生了CSRF攻击，我们如何及时的发现这些攻击呢？

CSRF攻击有着比较明显的特征：

- 跨域请求。
- GET类型请求Header的MIME类型大概率为图片，而实际返回Header的MIME类型为Text、JSON、HTML。

我们可以在网站的代理层监控所有的接口请求，如果请求符合上面的特征，就可以认为请求有CSRF攻击嫌疑。我们可以提醒对应的页面和项目负责人，检查或者 Review其CSRF防护策略。

# 个人用户CSRF安全的建议

经常上网的个人用户，可以采用以下方法来保护自己：

- 使用网页版邮件的浏览邮件或者新闻也会带来额外的风险，因为查看邮件或者新闻消息有可能导致恶意代码的攻击。
- 尽量不要打开可疑的链接，一定要打开时，使用不常用的浏览器。

# 总结

简单总结一下上文的防护策略：

- CSRF自动防御策略：同源检测（Origin 和 Referer 验证）。
- CSRF主动防御措施：Token验证 或者 双重Cookie验证 以及配合Samesite Cookie。
- 保证页面的幂等性，后端接口不要在GET页面中做用户操作。

为了更好的防御CSRF，最佳实践应该是结合上面总结的防御措施方式中的优缺点来综合考虑，结合当前Web应用程序自身的情况做合适的选择，才能更好的预防CSRF的发生。



参考 https://tech.meituan.com/2018/10/11/fe-security-csrf.html
