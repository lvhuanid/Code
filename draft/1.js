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
    const _set = new Set();
    const _set2 = new Set();
    test.documents.map(async item => {
        _set.add(item.value.data.ctp[0]);
        _set.add(item.value.data.ctp[1]);
        _set2.add(item.value.data.ctp[0].slice(0, item.value.data.ctp[0].lastIndexOf("/")));
        _set2.add(item.value.data.ctp[1].slice(0, item.value.data.ctp[1].lastIndexOf("/")));
        arr.push([item.value.data.ctp[0], item.value.data.ctp[1]]);
    });
    // console.log(_set2);
    // console.log(arr);
    // // 创建
    // [..._set].map(async item => {
    //     const a = await graph.query(`CREATE (:ctp { name: "${item}"})`);
    // });
    // [..._set2].map(async item => {
    //     const a = await graph.query(`CREATE (:ctp { name: "${item}"})`);
    // });
    // // 查询
    // arr.map(async item => {
    //     const p0 = item[0].slice(0, item[0].lastIndexOf("/"));
    //     const p1 = item[1].slice(0, item[1].lastIndexOf("/"));
    //     await graph.query(
    //         `MATCH (c1:ctp), (c2:ctp) WHERE c1.name = "${item[0]}" AND c2.name = "${item[1]}" CREATE (c1)-[r:con]->(c2) RETURN r `
    //     );
    //     await graph.query(
    //         `MATCH (c1:ctp), (c2:ctp) WHERE c1.name = "${p0}" AND c2.name = "${item[0]}" CREATE (c1)-[r:con]->(c2) RETURN r `
    //     );
    //     await graph.query(
    //         `MATCH (c1:ctp), (c2:ctp) WHERE c1.name = "${p1}" AND c2.name = "${item[1]}" CREATE (c1)-[r:con]->(c2) RETURN r `
    //     );
    // });
    //
    //
    // const result = await graph.query(`MATCH (c1:ctp)-[a:con]->(c2:ctp) RETURN a, c1, c2`);
    // const result2 = await graph.query(`MATCH (c:ctp) RETURN c`);
    // result.data.map(item => {
    //     console.log(item);
    // });
    // result2.data.map(item => {
    //     // console.log(item);
    // });
    // console.log(result, result.data.length);
    // ne:6:ptp:192.168.1.210:830:PTP=/shelf=1/slot=7/port=3
    // ne:6:ptp:192.168.1.210:830:PTP=/shelf=1/slot=3/port=101
    const getNextNode = async (db_key, type) => {
        // console.log("nodeId = ", node, id);
        const data = await dbJsonGet(`ne:6:${type}:192.168.1.210:830:${db_key}`);
        return data;
    };
    const testg = await getNextNode("PTP=/shelf=1/slot=7/port=3", "ptp");
    // if (testg.data.ctp) {
    //     await getNextNode(testg.data.ctp, "ctp");
    // }
    test.documents.map(async item => {
        const cpts = item.value.data.ctp;
        if (cpts.includes(testg.data.ctp)) {
            const cpt = cpts[0] !== testg.data.ctp ? cpts[0] : cpts[1];
            console.log(cpt);
            const ftp = cpt.slice(0, cpt.lastIndexOf("/"));
            const ftpNext = await getNextNode(ftp, "ftp");
            console.log(ftpNext);
            console.log(ftpNext.data["server-ctp"]);
            ftpNext.data["server-ctp"].map(async c => {
                arr.map(async a => {
                    if (a[0] === c) {
                        console.log(a);
                        const ctp = await getNextNode(a[1], "ctp");
                        const ctpN = await getNextNode(a[1].slice(0, cpt.lastIndexOf("/")), "ftp");
                        const ctpP = await getNextNode(ctpN.data["server-ctp"], "ctp");
                        const ctpP0 = await getNextNode(ctpP.data["server-tp"], "ptp");
                        console.log(ctp, ctpN, ctpP, ctpP0);
                    }
                });
            });
        }
    });
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
