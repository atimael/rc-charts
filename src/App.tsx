// import { TreeViewChart } from "./tree-chart/TreeViewChart.tsx";
import { ReactFlowProvider } from "@xyflow/react";
import { CallJourney } from "./flow-chart/FlowChart.tsx";
import { TreeViewChart } from "./tree-chart/TreeViewChart.tsx";

function App() {
  return (
    <div className="h-full bg-white">
      {/*<TreeChartOld/>*/}
      <ReactFlowProvider>
        {/*<TreeViewChart />*/}
        <CallJourney />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
