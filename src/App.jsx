// App.jsx
import React, { useState } from "react";
import ReactFlow from "./components/React-Flow";
import TemplateEditor from "./components/TemplateEditor";

const App = () => {
	const [isTemplate, setIsTemplate] = useState(false);
	return (
		<div className="p-8 space-y-4">
			<div className="flex gap-x-4">
				<button
					className={!isTemplate ? "text-blue-900" : "text-gray-600"}
					onClick={() => setIsTemplate(false)}
				>
					React Flow
				</button>
				<button
					className={isTemplate ? "text-blue-900" : "text-gray-600"}
					onClick={() => setIsTemplate(true)}
				>
					Template Editor
				</button>
			</div>
			<div>{isTemplate ? <TemplateEditor /> : <ReactFlow />}</div>
		</div>
	);
};

export default App;
