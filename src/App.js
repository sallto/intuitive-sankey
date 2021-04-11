import React from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePositionReorder } from "./use-position-reorder";
import { useMeasurePosition } from "./use-measure-position";
import "./styles.css";
import { ArcherContainer, ArcherElement } from "./react-archer";

/**
 * This is an example of drag-to-reorder in Framer Motion 2.
 *
 * By applying both drag and layout props to a component, if it changes place
 * in the DOM it'll either animate to its new position (if not dragging) or
 * stay stuck to the user's cursor (if dragging).
 */
/**
 * This is an example of drag-to-reorder in Framer Motion 2.
 *
 * By applying both drag and layout props to a component, if it changes place
 * in the DOM it'll either animate to its new position (if not dragging) or
 * stay stuck to the user's cursor (if dragging).
 */

export default class App extends React.Component {
  render() {
    return <Sankey />;
  }
}

export class Sankey extends React.Component {
  handleReorder = () => {
    this.myRef.refreshScreen();
  };

  render() {
    const relations = [];
    return (
      <AnimatePresence>
        <ArcherContainer
          ref={(myRef) => {
            this.myRef = myRef;
          }}
          offset={0}
        >
          <div className="horizontal">
            <List
              content={items}
              handleReorder={this.handleReorder}
              relations={relations}
            />
          </div>
        </ArcherContainer>
      </AnimatePresence>
    );
  }
}
function List({ content, handleReorder, relations }) {
  const [order, updatePosition, updateOrder] = usePositionReorder(content);

  return (
    <ul>
      {order.map((height, i) => (
        <Item
          key={height}
          height={height}
          i={i}
          updatePosition={updatePosition}
          updateOrder={updateOrder}
          handleReorder={handleReorder}
          relations={relations}
        />
      ))}
    </ul>
  );
}

function Item({
  i,
  height,
  updatePosition,
  updateOrder,
  handleReorder,
  relations
}) {
  const [isDragging, setDragging] = useState(false);

  const ref = useMeasurePosition((pos) => updatePosition(i, pos));
  const out = relations.filter((rel) => {
    return rel.sourceId === height;
  });

  const rel = [];
  out.length > 0 &&
    out.forEach((element) => {
      rel.push({
        targetAnchor: "topleft",
        sourceAnchor: "topright",
        targetOffsetY: element.targetOffsetY,
        sourceOffsetY: element.sourceOffsetY,
        style: {
          strokeWidth: element.weight,
          endShape: { arrow: { arrowLength: 0 } }
        },
        targetId: `${element.targetId}`
      });
    });
  return (
    <ArcherElement id={height} relations={rel}>
      <li
        style={{
          padding: 0,
          height,
          // If we're dragging, we want to set the zIndex of that item to be on top of the other items.
          zIndex: isDragging ? 3 : 1,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <motion.div
          ref={ref}
          layout
          initial={false}
          style={{
            background: "lime",
            height
          }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0px 3px 3px rgba(0,0,0,0.15)"
          }}
          whileTap={{
            scale: 1.12,
            boxShadow: "0px 5px 5px rgba(0,0,0,0.1)"
          }}
          drag="y"
          onDragStart={() => setDragging(true)}
          onDragEnd={() => setDragging(false)}
          onViewportBoxUpdate={(_viewportBox, delta) => {
            isDragging && handleReorder();
            isDragging && updateOrder(i, delta.y.translate);
          }}
        ></motion.div>
      </li>
    </ArcherElement>
  );
}

const items = [100];
