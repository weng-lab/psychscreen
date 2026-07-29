import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./graphql/client";
import { AboutUsPage, HomePage as WebHomePage } from "./web/HomePage";
import { DownloadsPage } from "./web/DownloadsPage";
import {
  DiseaseTraitPortal,
  GenePortal,
  SNPPortal,
  SingleCellPortal,
} from "./web/Portals";
import SingleCellCellTypeDetails from "./web/Portals/SingleCellPortal/SingleCellCellTypeDetails";
import DiseaseTraitDetails from "./web/Portals/DiseaseTraitPortal/DiseaseTraitDetails";
import SingleCellDetails from "./web/Portals/SingleCellPortal/SingleCellDetails";
import SingleCellDatasets from "./web/Portals/SingleCellPortal/SingleCellDatasets";
import GeneDetails from "./web/Portals/GenePortal/GeneDetails";
import GTexUMAP from "./web/Portals/GenePortal/GTexUMAP";
import SNPDetails from "./web/Portals/SnpPortal/SNPDetails";
import SingleCellDotPlot from "./web/Portals/SingleCellPortal/SingleCellDotPlot";
import SingleCellGeneRegulatoryDatasets from "./web/Portals/SingleCellPortal/SingleCellGeneRegulatoryDatasets";
import SingleCellCelltypeQTL from "./web/Portals/SingleCellPortal/SingleCellCelltypeQTL";
import SingleCelldegdisease from "./web/Portals/SingleCellPortal/SingleCelldegdisease";
import SingleCelldegdiseasect from "./web/Portals/SingleCellPortal/SingleCelldegdiseasect";
import { SingleCellGeneDetails } from "./web/Portals/SingleCellPortal/SingleCellGeneDetails";
import FooterPanel from "./web/HomePage/FooterPanel";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import AppBar from "./web/HomePage/AppBar";
import { getLegacyRouteTarget } from "./legacy-route";

export const PORTALS: [string, React.FC][] = [
  ["/traits", DiseaseTraitPortal],
  ["/gene", GenePortal],
  ["/snp", SNPPortal],
  ["/single-cell", SingleCellPortal],
];

const LegacyRouteRedirect: React.FC = () => {
  const location = useLocation();
  const target = getLegacyRouteTarget(location);

  return <Navigate replace to={target ?? "/"} />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={apolloClient}>
        <Router
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <div className="app">
            <div className="header">
              <AppBar />
            </div>
            <div className="main">
              <Routes>
                <Route path="/" element={<WebHomePage />} />
                <Route
                  path="/downloads"
                  element={<DownloadsPage />}
                />
                <Route path="/aboutus" element={<AboutUsPage />} />
                <Route
                  path="/traits/:disease"
                  element={<DiseaseTraitDetails />}
                />
                <Route
                  path="/single-cell/celltype/:celltype"
                  element={<SingleCellCellTypeDetails />}
                />
                <Route
                  path="/single-cell/datasets/Diff-expressed-genes/:disease"
                  element={<SingleCelldegdisease />}
                />
                <Route
                  path="/single-cell/datasets/Diff-expressed-genes/:disease/:celltype"
                  element={<SingleCelldegdiseasect />}
                />
                <Route
                  path="/single-cell/datasets/Gene-regulatory-networks/:celltype"
                  element={<SingleCellGeneRegulatoryDatasets />}
                />
                <Route
                  path="/single-cell/datasets/Cell-type-specific-eQTLs/:celltype"
                  element={<SingleCellCelltypeQTL />}
                />
                <Route
                  path="/single-cell/:disease/:gene"
                  element={<SingleCellDotPlot />}
                />
                <Route
                  path="/single-cell/:disease"
                  element={<SingleCellDetails />}
                />
                <Route
                  path="/single-cell/gene/:gene"
                  element={<SingleCellGeneDetails />}
                />
                <Route
                  path="/single-cell/datasets/:disease"
                  element={<SingleCellDatasets />}
                />
                <Route
                  path="/gene/:gene"
                  element={<GeneDetails />}
                />
                <Route
                  path="/gene/gtexumap"
                  element={<GTexUMAP />}
                />
                <Route
                  path="/snp/:snpid"
                  element={<SNPDetails />}
                />
                {PORTALS.map((portal, i) => (
                  <Route
                    key={i}
                    path={portal[0] as string}
                    element={React.createElement(portal[1], {})}
                  />
                ))}
                <Route
                  path="/psychscreen/*"
                  element={<LegacyRouteRedirect />}
                />
              </Routes>
            </div>
            <div className="footer">
              <FooterPanel />
            </div>
          </div>
        </Router>
      </ApolloProvider>
    </ThemeProvider>
  );
};
export default App;
