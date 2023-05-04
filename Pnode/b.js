const children = Object.entries(chassis_config).map(chassis => {
    let _className = `${styles.entity_common} ${styles.Card_6}`;
    let title = "";
    let _ports = [];
    let db_key = chassis[0];
    let _name = "";
    const {side, ...style} = chassis_config[chassis[0]];
    _meData.children.filter(child => {
        const {name, model: preconf} = child;
        const regex = /\/shelf=(\d+)\/slot=(\d+)/;
        const match = name.match(regex);
        let location;
        if (match) {
            const shelf = match[1];
            const slot = match[2];
            location = `${shelf}-${slot}`;
        }
        if (chassis[0] === location) {
            _name = child.name;
            db_key = child.db_key;
            _className = `${styles.entity_common} ${styles[preconf]}`;
            title = `名称: ${name}`;
            _ports = Object.entries(ChassisConfig_6?.[preconf]).map(item => {
                let title = "";
                let _name = item[0];
                let _db_key = item[0];
                const style = {...ChassisConfig_6[preconf][item[0]]};
                let className = `${styles.entity_common} ${styles["Port-NULL"]}`;
                child.children?.filter(port => {
                    if (item[0] === port.name.match(/port=(\d+)/)[1]) {
                        title = `名称: ${port.name}`;
                        className = `${styles.entity_common} ${styles[`Port-${preconf}-${item[0]}`]}`;
                        _name = port.name;
                        _db_key = port.db_key;
                        // laser-on laser-off
                        if (port["laser-status"] === "no-optical-module") {
                            className = `${styles.entity_common} ${styles["Port-No-Optical"]}`;
                        }
                    }
                });
                return {
                    title,
                    style,
                    className,
                    name: _name,
                    db_key: _db_key,
                    nodeType: "port",
                    type: 1
                };
            });
        }
    });
    return {
        ports: _ports,
        name: _name,
        db_key,
        style,
        className: _className,
        title,
        led: {show: false},
        fan: {show: false},
        nodeType: "port",
        type: 1
    };
});