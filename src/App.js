import {
  Box,
  Button,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";

// Custom Components
import TopBar from "./components/TopBar";

import "./App.css";
import { useState } from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

function renderTree(data, onClick) {
  return Object.entries(data).map(([key, value]) => {
    if (typeof value === "object") {
      return (
        <TreeItem key={key} nodeId={key} label={key}>
          {renderTree(value, onClick)}
        </TreeItem>
      );
    } else {
      return (
        <TreeItem
          key={key}
          nodeId={key}
          label={key}
          onClick={() => onClick(value)}
        />
      );
    }
  });
}

function App() {
  const DATA = {
    "AE-AQ": {
      "AE-AQ-VN00": {
        Data: "D1",
      },
      "AE-AQ-VN01": {
        Data: "D2",
      },
      "AE-AQ-VN02": {
        Data: "D2",
      },
    },
    "AE-OC": {
      "AE-OC-VN00": {
        Data: "D3",
      },
      "AE-OC-VN01": {
        Data: "D4",
      },
      "AE-OC-VN02": {
        Data: "D5",
      },
    },
  };

  const [darkMode, setDarkMode] = useState(false);
  const [data, setData] = useState("");
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? Object.keys(DATA).map(String) : []
    );
  };

  const handleSelectClick = () => {
    setSelected((oldSelected) =>
      oldSelected.length === 0 ? Object.keys(DATA).map(String) : []
    );
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <TopBar darkMode={darkMode} setDarkMode={setDarkMode} />
        {/* Two left and right Box */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left Box */}
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Box sx={{ mb: 1 }}>
              <Button onClick={handleExpandClick}>
                {expanded.length === 0 ? "Expand all" : "Collapse all"}
              </Button>
              <Button onClick={handleSelectClick}>
                {selected.length === 0 ? "Select all" : "Unselect all"}
              </Button>
            </Box>
            <TreeView
              aria-label="controlled"
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              expanded={expanded}
              selected={selected}
              onNodeToggle={handleToggle}
              onNodeSelect={handleSelect}
              multiSelect
            >
              {/* Generate the tree recursively based on your DATA */}
              {renderTree(DATA, setData)}
            </TreeView>
          </Box>
          {/* Right Box */}
          <Box sx={{ flexGrow: 1, p: 3 }}>
            {data ? data : "No Data Container Selected"}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

// function App() {
//   const [darkMode, setDarkMode] = useState(false);
//   const [data, setData] = useState("");

//   return (
//     <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
//       <CssBaseline />
//       <Box sx={{ flexGrow: 1 }}>
//         <TopBar darkMode={darkMode} setDarkMode={setDarkMode} />
//         {/* Two left and right Box */}
//         <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//           {/* Left Box */}
//           <Box sx={{ flexGrow: 1, p: 3 }}>LContent</Box>
//           {/* Right Box */}
//           <Box sx={{ flexGrow: 1, p: 3 }}>
//             {data ? data : "No Data Container Selected"}
//           </Box>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// }

export default App;
