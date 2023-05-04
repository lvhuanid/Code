if (type === "LINECARD") {
    // item?.prop("attrs/body", {
    //     refWidth: "75%",
    //     refWidth2: 20
    // });
        if (item.port.ports?.length >= 4) {
            const pos = item?.position();
            if (item.id === graphNode[0].id) {
                item?.position(pos.x + 150, pos.y - 75);
            } else {
                item?.position(pos.x, pos.y - 75);
            }
            item?.resize(150, 300);
        item?.prop("attrs/label", {y: 170});
        // item?.prop("portMarkup", [Markup.getForeignObjectMarkup()]);
        // const size = item?.size();
        // console.log(size.width, size.height);
    }
}
// DB_REDIS_URL
// redis://redis:taichitel@localhost:6379

