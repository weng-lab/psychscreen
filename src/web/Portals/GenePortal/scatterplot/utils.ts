
export const linearTransform = (d, r) => v =>
// https://gist.github.com/vectorsize/7031902
r[0] + (r[1] - r[0]) * ((v - d[0]) / (d[1] - d[0]));

export const ticks = (range, cscale = 1.0) => {
    const sfig = Math.pow(10.0, Math.floor(Math.log10(range[1])));
    const r: number[] = [], lrange = [ Math.floor(range[0] / sfig) * sfig, Math.ceil(range[1] / sfig) * sfig ];
    for (let i = lrange[0]; i <= lrange[1]; i += sfig * cscale) {
        r.push(i);
    }
    if (r.length <= 2) return range;
    return r.length > 10 ? ticks(range, cscale * 2) : r;
};


export const groupBy = (data, key) => {
    const results = {};
    data.forEach( d => {
        if (results[d.metadata[key]] === undefined) results[d.metadata[key]] = [];
        results[d.metadata[key]].push({
            y: d.value,
            x: d.metadata.agedeath_adult !== null ? d.metadata.agedeath_adult : d.metadata.agedeath_fetus
        });
    });
    return results;
};

export const groupedValues = (groupedData, k) => {
    const r = {};
    Object.keys(groupedData).forEach(key => {
        r[key] = groupedData[key].map(x => x[k])
    });
    return r;
};

export const standardDeviation = values => {

    if (values.length === 1) return 0.0;
    const avg = average(values);

    const squareDiffs = values.map(value => {
        const diff = value - avg;
        const sqrDiff = diff * diff;
        return sqrDiff;
    });

    const avgSquareDiff = average(squareDiffs);
    return Math.sqrt(avgSquareDiff);

}

export const average = data => (
    data.reduce( (sum, value) => sum + value, 0 ) / data.length
);
