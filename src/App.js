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
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "./Constants";

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

const recursiveFetchData = async (url, data, parent) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: url + "?rcn=4",
    headers: {
      Accept: "application/json",
      "X-M2M-RI": "12345",
      "X-M2M-Origin": "S{{aei}}",
    },
  };

  try {
    let response = await axios.request(config);
    for (let key in response.data["m2m:rsp"]) {
      let arr = response.data["m2m:rsp"][key];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i]["pi"] === parent) {
          if (arr[i]["con"]) {
            data[arr[i]["rn"]] = arr[i]["con"];
          } else {
            data[arr[i]["rn"]] = {};
            recursiveFetchData(
              url + "/" + arr[i]["rn"],
              data[arr[i]["rn"]],
              arr[i]["ri"]
            );
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchData = async (setData) => {
  let data = {};

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: API_URL,
    headers: {
      Accept: "application/json",
      "X-M2M-RI": "12345",
      "X-M2M-Origin": "S{{aei}}",
    },
  };

  try {
    let response = await axios.request(config);
    console.log(response.data);
    let rn = response.data["m2m:cb"]["rn"];
    data[rn] = {};
    recursiveFetchData(API_URL, data[rn], response.data["m2m:cb"]["ri"]);
    console.log(data);
    setData(data);
  } catch (error) {
    console.log(error);
  }
};

function App() {
  const [DATA, setDATA] = useState({});

  useEffect(() => {
    fetchData(setDATA);
  }, []);

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
