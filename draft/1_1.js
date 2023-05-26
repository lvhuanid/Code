const {createClient, Graph} = require("redis");
const {formatSymbolRedis} = require("../../micro_service/util/util");
const {dbJsonGet} = require("../../micro_service/util/db");

const main = async () => {
    const db = createClient({url: "redis://redis:taichitel@localhost:6380"});
    const graph = new Graph(db, "movies");
    await db.connect();
    const dbSearchExact = async (idx, filter, ret, option = {}) => {
        const getQueryStr = flt =>
            Object.entries(flt)
                .reduce((p, [k, v]) => {
                    if (v?.or) return `${p} @${k}:{${v.or.map(item => formatSymbolRedis(item)).join("|")}}`;
                    return `${p} @${k}:{${formatSymbolRedis(v)}}`;
                }, "")
                .trim();
        let queryStr;
        if (Array.isArray(filter))
            queryStr = filter.reduce((prev, flt) => `${prev === "" ? "" : `${prev}|`}(${getQueryStr(flt)})`, "").trim();
        else queryStr = filter.constructor === Object ? getQueryStr(filter) : filter;
        queryStr = queryStr === "" ? "*" : queryStr;
        return await db.ft.search(idx, queryStr, _getSearchOption(ret, option));
    };

    const _getSearchOption = (ret, option = {}) => {
        const {from = 0, size = 1000000, SORTBY} = option;
        return {
            ...(SORTBY !== "" && {SORTBY}),
            ...(from != null && size != null && {LIMIT: {from, size}}),
            ...(Array.isArray(ret) && {RETURN: ret})
        };
    };
    const dbJsonGet = async (...args) => await db.json.get(...args);

    const arr = [];
    const test = await dbSearchExact("ne:6:connection", {ne_id: "192.168.1.210:830"});
    test.documents.map(item => {
        arr.push([item.value.data.ctp[0], item.value.data.ctp[1]]);
    });
    const getNextNode = async (db_key, type) => {
        const data = await dbJsonGet(`ne:6:${type}:192.168.1.210:830:${db_key}`);
        return data;
    };
    // end PTP=/shelf=1/slot=3/port=101
    // start PTP=/shelf=1/slot=7/port=3
    const test1 = [];
    const test2 = [];
    const server = async (
        start = "PTP=/shelf=1/slot=7/port=3",
        end = "PTP=/shelf=1/slot=3/port=101",
        ne_id = "192.168.1.210:830"
    ) => {
        const connectArr = [];
        await dbSearchExact("ne:6:connection", {ne_id});
        test.documents.map(item => {
            connectArr.push([item.value.data.ctp[0], item.value.data.ctp[1]]);
        });
        // function factorial(num) {
        //     if (num === 0) {
        //         return 1;  // 基础情况
        //     }
        //     else {
        //         return num * factorial(num - 1); // 递归情况和递归调用
        //     }
        // }
        const tp = await getNextNode(start, "ptp");
        console.log(tp);
        const node = {ctp: tp.data.ctp, tp: null};
        loop(node, connectArr);
        setTimeout(() => {
            console.log(test1, test2, "ttttt");
        }, 2000);
    };

    const loop = async (node, connectArr, end = "PTP=/shelf=1/slot=3/port=101") => {
        while (node.ctp || node.tp) {
            const {ctp, tp} = node;
            let r;
            if (ctp) {
                // eslint-disable-next-line no-loop-func
                connectArr.map(con => {
                    if (con[0] === ctp) {
                        r = con[1];
                        test1.push(con);
                    }
                });
                if (r) {
                    
                    if (res !== null) {
                        node.ctp = res.data.ctp;
                        node.tp = res.data["server-tp"];
                        console.log(res, node);
                    }
                } else {
                    const res = await getNextNode(ctp, "ctp");
                    console.log(res);
                    node.ctp = null;
                    node.tp = res.data["server-tp"];
                }
            }
            if (tp) {
                let res;
                if (tp.startsWith("FTP")) {
                    res = await getNextNode(tp, "ftp");
                }
                if (tp.startsWith("PTP")) {
                    res = await getNextNode(tp, "ptp");
                }
                console.log(res);
                if (typeof res.data["server-ctp"] === "string") {
                    node.ctp = res.data["server-ctp"];
                    test2.push(node.ctp);
                    node.tp = null;
                } else {
                    // console.log(tp, res);
                    // node.ctp = res.data["server-ctp"][0];
                    // loop(node, connectArr);
                    if (res.data.name === end) {
                        return;
                    }
                    Object.entries(res.data["server-ctp"]).map(ctp => {
                        node.ctp = ctp[1];
                        node.tp = null;
                        loop(node, connectArr);
                        node.ctp = null;
                    });
                    console.log(res.data["server-ctp"][0], res);
                    node.tp = null;
                }
            }
        }
    };
    server();
    // const testg = await getNextNode("PTP=/shelf=1/slot=7/port=3", "ptp");
    // test.documents.map(async item => {
    //     const cpts = item.value.data.ctp;
    //     if (cpts.includes(testg.data.ctp)) {
    //         const cpt = cpts[0] !== testg.data.ctp ? cpts[0] : cpts[1];
    //         console.log(cpt);
    //         const ftp = cpt.slice(0, cpt.lastIndexOf("/"));
    //         const ftpNext = await getNextNode(ftp, "ftp");
    //         console.log(ftpNext);
    //         console.log(ftpNext.data["server-ctp"]);
    //         ftpNext.data["server-ctp"].map(async c => {
    //             arr.map(async a => {
    //                 if (a[0] === c) {
    //                     console.log(a);
    //                     const ctp = await getNextNode(a[1], "ctp");
    //                     const ctpN = await getNextNode(a[1].slice(0, cpt.lastIndexOf("/")), "ftp");
    //                     const ctpP = await getNextNode(ctpN.data["server-ctp"], "ctp");
    //                     const ctpP0 = await getNextNode(ctpP.data["server-tp"], "ptp");
    //                     console.log(ctp, ctpN, ctpP, ctpP0);
    //                 }
    //             });
    //         });
    //     }
    // });
};

main().then();
// GRAPH.QUERY movies "CREATE (:ctp {name:'Mark Hamill', actor_id:1}), (:Actor {name:'Harrison Ford', actor_id:2}), (:Actor {name:'Carrie Fisher', actor_id:3})"
// GRAPH.QUERY graph "MATCH ()-[a:ACTED_IN]->() RETURN a"

// a:City{name:'A'}
// > GRAPH.QUERY graph:movies "MATCH (a:Actor),(m:Movie) WHERE a.actor_id = 1 AND m.movie_id = 1 CREATE (a)-[r:Acted_in {role:'Luke Skywalker'}]->(m) RETURN r"

// `MATCH (c1:ctp) WHERE c1.name = "${item[0]}" CREATE (c0)-[r:con]->(c1:ctp{name:"${item[1]}"}), (:ctp{name:"${p0}"})-[:con]->(c0), (c1)-[:con]->(:ctp{name:"${p1}"}) RETURN r`
// `MATCH (c0:ctp) WHERE c0.name = "${item[0]}" CREATE (c0)-[r:con]->(c1:ctp{name:"${item[1]}"}), (:ctp{name:"${p0}"})-[:con]->(c0), (c1)-[:con]->(:ctp{name:"${p1}"}) RETURN r`
// const a = await graph.query(`MATCH (c1:ctp{name:"${item[0]}"})-[r:con]->(c2:ctp{name:"${item[1]}"}) RETURN r`);

// GRAPH.QUERY movies "MATCH (a:Actor), (m:Actor) WHERE a.actor_id = 3 AND m.actor_id = 1 CREATE (a)-[r:CCC {role:'Princess Leila'}]->(m) RETURN r"
// await graph.query("CREATE (:Rider { name: $riderName })-[:rides]->(:Team { name: $teamName })", {
//     params: {
//         riderName: "Buzz Aldrin",
//         teamName: "Apollo"
//     }
// });
//
// const result = await graph.roQuery("MATCH (r:Rider)-[:rides]->(t:Team { name: $name }) RETURN r.name AS name", {
//     params: {
//         name: "Apollo"
//     }
// });
