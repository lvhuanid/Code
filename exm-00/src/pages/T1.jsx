import { useState, useRef, useEffect } from "react";
// import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { Graph, Markup, Shape } from "@antv/x6";
import { Tooltip } from "antd";

const MyComponent = ({ text }) => {
  return <div>hellos</div>;
};
const T1 = () => {
  const ref = useRef();
  const refGraph = useRef();

  useEffect(() => {
    const graph = new Graph({
      container: ref.current,
      width: 1000,
      height: 1000,
      grid: true,
    });

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      shape: "html",
      html() {
        const wrap = document.createElement("div");
        wrap.style.width = "100%";
        wrap.style.height = "100%";
        wrap.style.background = "#000";
        wrap.innerText = "Hello";

        return wrap;
      },
    });

    const target = graph.addNode({
      shape: "react-shape",
      x: 180,
      y: 160,
      width: 100,
      height: 40,
      component(node) {
        const data = node.getData();
        return <div>{data.text}</div>;
      },
    });

    graph.addEdge({
      source,
      target,
    });
  });

  return (
    <>
      <div ref={ref}>T</div>
    </>
  );
};

export default T1;
