import {useState, useRef, useEffect} from 'react'
import { createRoot } from 'react-dom/client';
import {Graph, Markup, Shape} from '@antv/x6'
import {Tooltip, Button,Progress } from 'antd'
import { register } from "@antv/x6-react-shape";
import './T.css'

const NodeComponent = ({node}) => {
    const onclick = (e) => {
        console.log(node.getData().a)
    }
    return (
        <>
            <Button type='primary' onClick={onclick}>tacke me</Button>
        </>

    );
  };
//   Shape.HTML.register({
//     shape: "custom-html",
//     width: 160,
//     height: 80,
//     html() {
//       const div = document.createElement("div");
//       div.className = "custom-html";
//       return div;
//     },
//   });
  register({
    shape: "custom-react-node",
    effect: ["data"],
    component: NodeComponent,
  });
  
const T0 = () => {
    const ref = useRef();
    useEffect(()=>{
        const graph = new Graph({
            container: ref.current,
            height: 1000,
            width: 1000,
            background: {
                color: '#F2F7FA',
              },
        });
        graph.addNode({
            shape: "custom-react-node",
            width:90,
            height:30,
            x: 20,
            y: 20,
            data: {
                a: "30",
              },
          });
          graph.addNode({
            shape: "custom-react-node",
            width:90,
            height:30,
            x: 120,
            y: 20,
          });
          graph.addNode({
            shape: "custom-react-node",
            width:90,
            height:30,
            x: 120,
            y: 120,
          });
        //   graph.addNode({
        //     shape: "custom-html",
        //     x: 100,
        //     y: 40,
        //     width: 1000,
        //     height: 400,
        //   });
        graph.centerContent()
    },[])

  return (
  <>
  <div className="react-basic-app">

 
    <div className='app-content'  ref={ref}></div>
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">

    <polygon points="5,5 195,10 185,185 10,195" />

    <foreignObject x="20" y="20" width="160" height="160">
    <div>hello</div> 
    </foreignObject>
    </svg>
</div>
  </>
  )
}

export default T0