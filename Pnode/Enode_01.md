mile            英里
mine            我的
rant            激昂的演说
actor           演员
communicate         沟通
ghost           鬼
ticket          票
megapixel           像素
communicating           沟通
psychology          心理学
instead         而不是
hospital            医院
covered         覆盖
distinction         区别
finder          仪
copper          铜
everyday            日常
pull            拉
contrary            相反
pride           骄傲
roller          辊
trader          交易员
focused         集中
gourmet         美食
county          县
commissions         佣金
signature           签名
beta            β
disclose            披露


5/13 设备图，模型驱动 620 m5b 和 m3b 机框图

5/20 修复bug 优化设备图，正在做业务视图

protocolshi


## 右侧竖梯形
```js
    points: "1 0.5,1 3,2 2.5,2 1",
    label: "MUX"
```

### 左侧
```js
    points: "1 1.35,1 2.65,2 3,2 1",
    label: "MUX"
```

### 未搬代码
```js chasis.js 425
if (ChassisConfig?.[actual]?.led) {
    // Add alarm
    let className = styles.led_COMMON;
    if (child?.mcu && child?.mcu?.state.active === "false") {
        className += ` ${styles.led_DISABLE}`;
}
```