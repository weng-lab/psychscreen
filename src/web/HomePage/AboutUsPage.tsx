import React from "react";
import { Divider, GridProps, Stack, Typography } from "@mui/material";
import AboutUsPanel from "./AboutUsPanel";
import Grid2 from "@mui/material/Unstable_Grid2";
import psychSCREEN_about from "../../assets/about.png";

const AboutUsPage: React.FC<GridProps> = (props) => {
  return (
    <Stack
      mt={7}
      mb={7}
      ml={"auto"}
      mr={"auto"}
      maxWidth={{ xl: "50%", lg: "65%", md: "75%", sm: "80%", xs: "90%" }}
      spacing={1}
    >
      <Typography variant="h3">About PsychSCREEN</Typography>
      <Divider />
      <Typography>
        PsychSCREEN is a web-based platform designed to facilitate the
        interactive visualization and exploration of genetic and epigenetic data
        on the human brain. The mission of PsychSCREEN is to enhance the
        understanding of the regulatory elements in the brain that contribute to
        psychiatric conditions. By integrating a vast array of epigenetic data
        and utilizing advanced deep-learning techniques, PsychSCREEN provides an
        interactive atlas of candidate brain cis-Regulatory Elements (b-cCREs).
        These elements are crucial for understanding how gene regulation occurs
        in different types of brain cells, including various glia and neurons,
        and how these processes might be altered by genetic variants such as
        single-nucleotide polymorphisms (SNPs) in psychiatric disorders.
      </Typography>
      <Typography variant="h4" pt={2}>
        Key Features
      </Typography>
      <Typography variant="h5">Interactive Visualization:</Typography>
      <Typography variant="body1">
        PsychSCREEN offers a user-friendly interface for visualizing genomic
        annotations from diverse biological perspectives. Users can explore the
        data through four distinct portals, each providing unique insights into
        brain cell types and their regulatory elements.
      </Typography>
      <Typography variant="h5">Disease and Trait Portal:</Typography>
      <Typography variant="body1">
        This portal allows users to search for specific psychiatric traits or
        disorders, such as schizophrenia or neuroticism, and visualize
        associated risk loci. It integrates genome-wide association studies
        (GWAS) summary statistics and provides interactive genome browser views
        for detailed exploration of significant SNPs and their annotations.
      </Typography>
      <Typography variant="h5">Gene Portal:</Typography>
      <Typography variant="body1">
        Users can input the name of a gene to explore single-cell expression and
        differential expression in psychiatric disease (DOI:
        <a href="https://doi.org/10.1126/science.adi5199">
          10.1126/science.adi5199
        </a>
        ). Furthermore, users can access a comprehensive view of the gene's
        regulatory annotations, expression patterns, and associated SNPs. This
        portal includes data from single-cell and bulk ATAC-seq datasets,
        providing a detailed view of gene regulation in the brain. Users can
        also navigate an interactive genome browser, displaying single-cell
        ATAC-seq signal, as well as deep-learned models of base-pair resolution
        importance to chromatin accessibility, around the gene of interest.
      </Typography>
      <Typography variant="h5">SNP Portal:</Typography>
      <Typography variant="body1">
        Users can search variants by rsID and view various types of quantitative
        trait loci (QTLs) from PsychENCODE projects (DOI:{" "}
        <a href="https://doi.org/10.1126/science.adi5199">
          10.1126/science.adi5199
        </a>
        , DOI:{" "}
        <a href="https://doi.org/10.1126/science.adh0829">
          10.1126/science.adh0829
        </a>
        , DOI:{" "}
        <a href="https://doi.org/10.1126/sciadv.adh2588">
          10.1126/sciadv.adh2588
        </a>
        ), summary statistics of GWAS, and intersecting regulatory regions from
        the ENCODE registry of candidate cis-Regulatory Elements (cCREs) and
        candidate brain cis-Regulatory Elements (b-cCREs).
      </Typography>
      <Typography variant="h5">Single-Cell Portal:</Typography>
      <Typography variant="body1">
        This portal offers exploration of single-cell datasets, including
        differential gene expression and chromatin accessibility in various
        brain cell types. It also provides insights into cell type-specific
        regulatory networks and their implications for brain function and
        psychiatric disorders. Users can visualize single-cell ATAC-seq peaks,
        gene regulatory networks, and expression GTLs (eQTLs) derived from
        PsychENCODE data (DOI:{" "}
        <a href="https://doi.org/10.1126/science.adi5199">
          10.1126/science.adi5199
        </a>
        ).
      </Typography>
      <Typography variant="h5">Downloadable Data:</Typography>
      <Typography variant="body1">
        PsychSCREEN makes available all datasets, computational models, and GWAS
        analyses described in the platform for download in common bioinformatic
        formats, supporting further research and analysis by the scientific
        community.
      </Typography>
      <Typography variant="h4" pt={2}>
        Technology and Accessibility
      </Typography>
      <Typography>
        PsychSCREEN was built using modern web technologies, including the
        ReactJS framework for a seamless user experience and scalable vector
        graphics (SVG) for high-quality data visualization. The platform's
        backend is powered by a microservice architecture utilizing Postgres
        databases and GraphQL application programming interfaces (APIs),
        ensuring efficient data retrieval and extensibility. For programmatic
        access, PsychSCREEN provides a publicly available GraphQL API (
        <a href="https://psychscreen.api.wenglab.org/graphql">
          psychscreen.api.wenglab.org/graphql
        </a>
        ), allowing advanced users to query the datasets directly and integrate
        them into their research workflows.
      </Typography>
      <Typography variant="h4" pt={2}>
        How to Cite PsychSCREEN
      </Typography>
      <Typography>
        PsychSCREEN was designed and built by Dr. Zhiping Weng's lab in
        collaboration with Drs. Jill Moore and Andres Colubri's labs at UMass
        Chan Medical School, as a product of the{" "}
        <a href="https://psychencode.org">PsychENCODE Consortium</a>.
        PsychSCREEN was published in:
      </Typography>
      <Typography pb={2}>
        Pratt, H. E., Andrews, G., Shedd, N., Phalke, N., Li, T., Pampari, A.,
        ... & Weng, Z. (2024). Using a comprehensive atlas and predictive models
        to reveal the complexity and evolution of brain-active regulatory
        elements. <i>Science Advances</i>, 10(21).{" "}
        <a href="https://doi.org/10.1126/sciadv.adj4452">
          https://doi.org/10.1126/sciadv.adj4452
        </a>
      </Typography>

      <img src={psychSCREEN_about} />
      <Typography variant="body1" pt={2}>
        <b>A: PsychSCREEN's Disease/SNP Portals.</b> A written description of
        the queried disease—Schizophrenia (top right)—is displayed with a view
        of all risk loci identified by GWAS, as well as the location of these
        risk loci in the genome (bottom left). Clicking on a locus redirects you
        to a genome browser (bottom right) spanning the highlighted coordinates,
        displaying tracks representing candidate brain cis-Regulatory Elements
        (b-cCREs), aggregate neuron and glia ATAC-seq signal, Schizophrenia GWAS
        summary statistics, a set of documented SNPs and their linkage
        disequilibrium, and base-pair resolution mammalian conservation scores.
      </Typography>
      <Typography variant="body1">
        <b>
          B: PsychSCREEN's Gene Portal, upon searching for the gene <i>OLIG2</i>
          .
        </b>{" "}
        The genome browser is the default view, displaying candidate brain
        cis-Regulatory Elements (b-cCREs), aggregate neuron and glia ATAC-seq
        signal, and ATAC-seq signal for an individual experiment and their
        respective predicted importance scores from ChromBPNet models of
        PsychENCODE data. On the ChromBPNet track, highlighting a section of
        bases (shaded in red) will prompt a search of the closest matching TF
        motif, and the resultant motif logo will be displayed.
      </Typography>
      <Typography variant="body1">
        <b>
          C: PsychSCREEN's Single-Cell Portal, upon searching for the gene{" "}
          <i>SOX8</i>.
        </b>{" "}
        The UMAP plot for a scRNA-seq experiment is displayed (top), with the
        color of each dot representing the expression (natural log-transformed
        counts per 105 total sequencing reads) of the queried gene.
        Alternatively, a dot plot (bottom) can be displayed, with the size of
        the circle representing the percentage of cells in a particular cluster
        expressing the queried gene, and the opacity representing the average
        expression of the gene in that cluster.
      </Typography>
    </Stack>
  );
};

export default AboutUsPage;
