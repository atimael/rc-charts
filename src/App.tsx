import { TreeViewChart } from "./tree-chart/TreeViewChart.tsx";
import { ReactFlowProvider } from "@xyflow/react";

function App() {
  return (
    <div className="h-full bg-white">
      {/*<TreeChartOld/>*/}
      <ReactFlowProvider>
        <TreeViewChart />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
