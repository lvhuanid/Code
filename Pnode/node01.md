DDoS Attack means "Distributed Denial-of-Service (DDoS) Attack" and it is a cybercrime in which the attacker floods a server with internet traffic to prevent users from accessing connected online services and sites.

debugger;
直接输入可调试

## type assertions
```ts
const myCanvas = document.getElementById("canvas") as HTMLCanvasElement;
// angle-braket 
const myCanvas = <HTMLCanvasElement>document.getElementById("canvas");
```

## new words
- trace         查询
- obfuscated    模糊
- symbolication
- investigate   调查
- ultimately    最终
- pitfalls      陷阱

### useImmer
- A hook to use immer as a React hook to manipulate state.

## 模型驱动
指令 1
```
1984  ll
 1985  cp ~hx/9690136_tnms.taichitel.com.* tnms/service/nginx/conf.d/
 1986  cd tnms/service/nginx/conf.d/
 1987  ls
 1988  vi default.conf
 1989  cd
 1990  cd tnms
 1991  docker-compose down
 1992  docker-compose up
 1993  cd /etc/
 1994  ip a
 1995  cd netplan/
 1996  ls
 1997  vi 00-installer-config.yaml
 1998  netplan apply
 1999  ip a
 2000  ll
 2001  cd data
 2002  ll
 2003  cd
 2004  tar cvf ~hx/data0522.tar data

```
需要使用 su-
密码 1
才会显示data

使用 npm path 给修改的node_module 文件打补丁

### redis 修改单个值
 await db.json.set("testtesttest", "$", {a: {"c-i": 4, c: 5}, b: {dd: 45, ff: 888}});
    await db.json.set("testtesttest", "$.a-i", "fddf");
    console.log(await db.json.get("testtesttest"));

```
-> (a hyphen followed by a right angle bracket)
```
Associated 关联
Implicitly Assigned Raw Values

card-1-20

## security Vulnerabilities
https://youtu.be/ypNKKYUJE5o


```jsx
import React from "react";
import {BrowserRouter as Router, useLocation} from "react-router-dom";

export default function Root() {
    return (<Router><QueryParamsDemo /></Router>)
}

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(()=> URLSearchParams(search), [search])
}

function QueryParamsDemo() {
    let query = useQuery();

    function validateURL(url) {

        if(userSuppliedUrl) {
            return url;
        }
        return "/";
    }

    return(
        <div>
            <h2>Return Home</h2>
            <a href={validataeURL(query.get("redirect"))}>click</a>
        </div>
    )
}
```
```js
app.get("/api/data", async (req, res) => {
    const allowedURLs = ["https://baidu.com", "https://bilibili.com"];

    const url = req.query.url;
    try {
        if(!allowedURLs.includes(url)) {
            return res.status(400).json({ error: "Bad URL"});
        }

        const response = await fetch(url);
        const data = await response.json();

        res.status(200).json({data: data})
    } catch (err) {
        console.log(err)
        res.status(500).json({err: err.msg})
    }
})
```
```jsx
import crypto from "crypto"

export function checkToken(userSupplied) {
    const account = account.retriveToken(userSupplied)
    if (account) {
        if (crypto.timingSafeEqual(account.service.token, user.service.token)) {
            return true
        }
    }
    return false
}
```