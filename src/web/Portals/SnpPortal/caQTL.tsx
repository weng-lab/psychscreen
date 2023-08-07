
import React from "react";
import { Typography } from "@weng-lab/psychscreen-ui-components";
import { CircularProgress, Link } from "@mui/material";
  
export const CAQTL = ({caqtls,loading}) =>{

   
  
    return (<>
    { loading ? <CircularProgress/> :
    <Typography
    type="display"
    size="small"
    style={{ fontWeight: 500, fontSize: "28px" }}
  >
    {caqtls.length===2 ? 
(
    "This SNP was determined to be a chromatin accessibility quantitative trait loci (caQTL) in neurons and glia in a PsychENCODE study by Roussos and colleagues (doi:"

) : caqtls.find(c=>c.type==="glia") ?
'This SNP was determined to be a chromatin accessibility quantitative trait loci (caQTL) in glia but not neurons in a PsychENCODE study by Roussos and colleagues (doi:'
: 
caqtls.find(c=>c.type==="neuron") ? 
'This SNP was determined to be a chromatin accessibility quantitative trait loci (caQTL) in neurons but not glia in a PsychENCODE study by Roussos and colleagues (doi:' 
:         
'This SNP was not determined to be a chromatin accessibility quantitative trait loci (caQTL) in neurons or glia in a PsychENCODE study by Roussos and colleagues (doi:'}
        <Link
rel="noopener noreferrer"
target="_blank"
href={`https://doi.org/10.1101/2023.03.02.530826`}
>
    10.1101/2023.03.02.530826
</Link>).
    
  </Typography>}</>)

}