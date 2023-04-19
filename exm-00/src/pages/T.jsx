import {useState, useRef, useEffect} from 'react'
// import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';
import {Graph, Markup} from '@antv/x6'
import {Tooltip} from 'antd'
import "./T.css"
const T = () => {
    const ref = useRef();
    useEffect(()=>{
        const graph = new Graph({
            container: ref.current,
            width: 800,
            height: 600,
            grid: true,
            background: {
                color: "#F2F7FA",
            },
            onPortRendered(args) {
                const selectors = args.contentSelectors;
                const container = selectors && selectors.foContent;
                console.log(selectors)
                if (container) {
                    createRoot(container).render(
                        <Tooltip title="port">
                            <div className="my-port" />
                        </Tooltip>
                    )
                }
            }
        });
         graph.addNode({
            x: 40,
            y: 35,
            width: 160,
            height: 30,
            label: "Hello",
            attrs: {
                body: {
                strokeWidth: 1,
                stroke: "#108ee9",
                fill: "#fff",
                rx: 5,
                ry: 5
                }
            },
            portMarkup: [Markup.getForeignObjectMarkup()],
            ports: {
                items: [
                { group: "in", id: "in1" },
                { group: "in", id: "in2" },
                { group: "out", id: "out1" },
                { group: "out", id: "out2" }
                ],
                groups: {
                in: {
                    position: { name: "top" },
                    attrs: {
                    fo: {
                        width: 10,
                        height: 10,
                        x: -5,
                        y: -5,
                        magnet: "true"
                    }
                    },
                    zIndex: 1
                },
                out: {
                    position: { name: "bottom" },
                    attrs: {
                    fo: {
                        width: 10,
                        height: 10,
                        x: -5,
                        y: -5,
                        magnet: "true"
                    }
                    },
                    zIndex: 1
                }
                }
            }
        });
    },[])

  return (
  <>
    <div ref={ref}>T</div>
     <Tooltip title="port">aaa</Tooltip>
  </>
  )
}

export default T