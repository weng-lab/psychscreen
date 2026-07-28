# PsychSCREEN Genome Browser Demo Script

This is a loose script for a short browser demonstration. Text in quotation marks is suggested narration; instructions in italics are actions to take on screen.

## Opening

> "I'm going to use two examples to show how PsychSCREEN lets us examine cell type-specific and developmental DNA methylation in the human brain. Rather than reviewing every browser feature, I'll start with a biological question and use the browser to investigate it."

## Example 1: ADARB2 methylation by inhibitory neuron type

> "The first example comes from Mukamel et al. They reported that ADARB2 is enriched in CGE-derived inhibitory neurons, including VIP and LAMP5 populations. These cells also show relatively low DNA methylation across the ADARB2 gene body."

### Find the gene

*Enter `ADARB2` in **Change Browser Region** and select the gene.*

> "The search takes us directly to ADARB2 on the GRCh38 human genome assembly. The annotation at the bottom shows the gene body and its transcription direction."

### Add the comparison tracks

*Open **Select Tracks**, choose **Mukamel 2024 Methylation**, and add:*

- `CGE_ADARB2_ADAM33`
- An `MGE_PVALB_*` track

> "The track selector organizes these data by cell type, donor age, and donor sex. For this comparison, I've selected a CGE-derived ADARB2 population and an MGE-derived PVALB population."

### Explain the track

> "Blue represents CpG methylation, orange represents non-CG or CH methylation, and the dark gray line shows sequencing depth. The upper and lower halves show the forward and reverse DNA strands."

*Point across the ADARB2 gene body in both tracks.*

> "The MGE_PVALB population shows more CpG methylation across ADARB2 than the CGE_ADARB2 population. This is consistent with ADARB2 being more active in the CGE-derived population."

### Demonstrate interaction

*Zoom into part of the gene body and hover over matching positions in both tracks.*

> "I can zoom to base-level regions and hover over a position to inspect the numerical methylation and coverage values. These values are the safest way to compare the Mukamel tracks because their visual scales may be calculated independently. I also check sequencing depth so that I don't interpret a low-coverage region as a biological difference."

### Optional donor comparison

*If time permits, add `.young` and `.old`, or `.female` and `.male`, versions of the CGE track.*

> "The broad profile remains similar when donors are separated by age or sex. This illustrates the reproducibility reported in the paper, although it doesn't mean that smaller age- or sex-associated differences cannot exist."

### Transition

> "This example showed a cell type difference at one age-aggregated locus. The next example uses the CAVE tracks to add a developmental dimension."

## Example 2: SLC6A7 methylation across development

> "SLC6A7 encodes a high-affinity proline transporter involved in locomotion and learning. The study reported similar SLC6A7 expression in glutamatergic and MGE-GABA neurons during infancy. Over the first decade of life, expression increased in glutamatergic neurons and decreased in MGE-GABA neurons. The authors observed a corresponding methylation difference."

### Find the gene and add CAVE tracks

*Search for `SLC6A7`, then select these **Brainome Developmental Methylation** tracks:*

- `Brainome GLU Infancy`
- `Brainome GABA Infancy`
- `Brainome GLU Late Childhood`
- `Brainome GABA Late Childhood`

> "Here I've selected matched glutamatergic and GABAergic tracks from infancy and late childhood. The track selector also provides early childhood, adolescence, early adulthood, and adulthood if we want to inspect the complete trajectory."

### Explain the CAVE display

> "In each CAVE track, the upper, lighter signal is hydroxymethylcytosine, or hmC. The lower, darker OXBS signal represents mCG. Unlike the previous example, all CAVE tracks use the same zero-to-one scale, so their signal heights can be compared directly."

*Point out the promoter near the transcription start site and then trace the gene body.*

### Compare infancy with late childhood

> "During infancy, the glutamatergic and GABAergic methylation patterns are broadly similar. By late childhood, the glutamatergic neurons show a stronger reduction in mCG across the promoter and gene body than the GABAergic neurons."

> "That divergence is consistent with the paper's finding that SLC6A7 expression increases in glutamatergic neurons while decreasing in MGE-GABA neurons during childhood."

*Zoom into the promoter or a representative part of the gene body and hover over matching positions.*

> "Again, hovering lets us compare the underlying hmC and OXBS values at the same genomic position rather than relying only on the overall shape of the tracks."

## Closing

> "Together, these examples show two useful ways to explore the data. ADARB2 demonstrates cell type-specific methylation, while SLC6A7 shows how methylation diverges between neuronal populations during development. PsychSCREEN lets us move from a published biological claim to the relevant locus, select comparable populations, and inspect the underlying signal interactively."

> "These browser views support the methylation portions of the published findings. They don't directly display RNA expression, so the expression conclusions come from the papers' integrated analyses rather than these tracks alone."

## Presenter notes

- Say **"consistent with"** or **"supports"**, rather than claiming that a small browser comparison proves the complete result.
- For the Mukamel tracks, prefer tooltip values over visual signal height because tracks may be independently auto-scaled.
- For the CAVE tracks, direct visual comparisons are appropriate because every track uses the same 0–1 scale.
- The browser labels the Brainome population as **GABA**, while the paper specifically says **MGE-GABA**. Confirm that these labels represent the same source grouping before calling them identical.
- If time is short, omit the donor comparison and use only the four SLC6A7 tracks listed above.
