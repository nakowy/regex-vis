import React, { useRef, useState, useEffect } from "react"
import { Node, Root } from "@types"
import { RenderNode, RenderConnect, Box } from "./types"
import Traverse from "./traverse"
import RailNode from "./node"
import Connect from "./connect"
import SvgContainer from "./svgContainer"
type Props = {
  root: Root
  selectedNodes: Node[]
  onSelect?: (ids: Node[]) => void
}
const Flowchart: React.FC<Props> = props => {
  const { root, onSelect, selectedNodes } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [traverse] = useState<Traverse>(new Traverse(canvasRef))
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [renderNodes, setRenderNodes] = useState<RenderNode[]>([])
  const [renderConnects, setRenderConnects] = useState<RenderConnect[]>([])
  useEffect(() => {
    const { width, height, renderNodes, renderConnects } = traverse.t(root.r)
    setWidth(width)
    setHeight(height)
    setRenderNodes(renderNodes)
    setRenderConnects(renderConnects)
  }, [root, traverse])
  function onDragSelect(box: Box) {
    const { x: _x, y: _y, width: _width, height: _height } = box
    const renderNodes = traverse.renderNodes
    const chainNodes = traverse.chainNodes
    const nodes = renderNodes
      .filter(renderNode => {
        const { node, x, y, width, height } = renderNode
        if (node.type === "root") {
          return false
        }
        const overlapX = _x < x && _x + _width > x + width
        const overlapY = _y < y && _y + _height > y + height
        return overlapX && overlapY
      })
      .map(renderNode => renderNode.node)
    for (let i = 0; i < chainNodes.length; i++) {
      if (chainNodes[i].some(item => nodes.some(node => node === item))) {
        let selectNodes = chainNodes[i].filter(item =>
          nodes.some(node => node === item)
        )
        onSelect && onSelect(selectNodes)
        break
      }
    }
  }
  function onClick(node: Node) {
    let nodes = [node]
    if (selectedNodes.length === 1 && selectedNodes.includes(node)) {
      nodes = []
    }
    onSelect && onSelect(nodes)
  }
  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: "-9999px", left: "-9999px" }}
      ></canvas>
      <SvgContainer width={width} height={height} onDragSelect={onDragSelect}>
        {renderNodes.map(renderNode => {
          const { x, y, width, height, node } = renderNode
          const { id } = node
          return (
            <RailNode
              x={x}
              y={y}
              width={width}
              height={height}
              node={node}
              selected={selectedNodes.includes(node)}
              onClick={onClick}
              key={id}
            />
          )
        })}
        {renderConnects.map(renderConnect => {
          const { type, start, end, id } = renderConnect
          return <Connect type={type} start={start} end={end} key={id} />
        })}
      </SvgContainer>
    </>
  )
}

export default Flowchart
